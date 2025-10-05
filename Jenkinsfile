// @Library('jenkins-shared-library') _ // Removed unless you have a specific shared library configured

pipeline {
    agent any
    
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }
    
    environment {
        // Tool versions
        NODE_VERSION = '20'
        DOCKER_BUILDKIT = '1'
        
        // Application settings
        APP_NAME = 'xportal'
        APP_VERSION = "${env.BUILD_NUMBER}"
        
        // Credentials (configured in Jenkins)
        SUPABASE_URL = credentials('supabase-url')
        SUPABASE_ANON_KEY = credentials('supabase-anon-key')
        VERCEL_TOKEN = credentials('vercel-token')
        SONAR_TOKEN = credentials('sonar-token')
        SNYK_TOKEN = credentials('snyk-token')
        
        // SonarQube settings
        SONAR_HOST_URL = 'http://localhost:9000'
        SONAR_PROJECT_KEY = 'xportal'
    }
    
    tools {
        nodejs "NodeJS-${NODE_VERSION}"
    }
    
    stages {
        stage('🔍 Checkout') {
            steps {
                script {
                    echo "=== Checking out code from GitHub ==="
                    checkout scm
                    
                    sh '''
                        echo "Node version: $(node --version)"
                        echo "NPM version: $(npm --version)"
                        echo "Docker version: $(docker --version)"
                        ls -la
                    '''
                    
                    currentBuild.description = "Branch: ${env.GIT_BRANCH}"
                }
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                script {
                    echo "=== Installing Node.js dependencies ==="
                    sh 'npm ci --frozen-lockfile'
                    sh 'npm install -g snyk newman newman-reporter-htmlextra vercel'
                }
            }
        }
        
        stage('🔨 Build Application') {
            steps {
                script {
                    echo "=== Building Next.js application and Docker image ==="
                    sh 'npm run build'
                    
                    if (!fileExists('.next')) {
                        error "Build failed - .next directory not found"
                    }
                    
                    sh """
                        docker build \\
                            --build-arg NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL} \\
                            --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY} \\
                            -t ${APP_NAME}:${BUILD_NUMBER} \\
                            -t ${APP_NAME}:latest .
                    """
                    sh "docker images | grep ${APP_NAME}"
                }
            }
            post {
                success {
                    echo "✅ Build stage completed successfully"
                    archiveArtifacts artifacts: '.next/**/*', fingerprint: true, allowEmptyArchive: true
                }
            }
        }
        
        stage('🧪 Test Application') {
            parallel {
                stage('Playwright E2E Tests') {
                    steps {
                        script {
                            echo "=== Running Playwright E2E tests on local container ==="
                            sh 'npx playwright install --with-deps chromium'
                            // Run app container on a non-conflicting port
                            sh "docker run -d --name xportal-test-${BUILD_NUMBER} -p 3001:3000 \
                                 -e NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL} \
                                 -e NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY} \
                                 ${APP_NAME}:${BUILD_NUMBER}"
                            
                            sh '''
                                for i in {1..30}; do
                                    if curl -s http://localhost:3001/api/health > /dev/null; then
                                        echo "✅ Test container is ready"
                                        break
                                    fi
                                    echo "Waiting for container... ($i/30)"
                                    sleep 2
                                done
                            '''
                            // Set base URL for Playwright to hit the container port
                            sh 'PLAYWRIGHT_TEST_BASE_URL=http://localhost:3001 npm run test:ci'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'test-results/**/*.xml'
                            // ##### THIS BLOCK HAS BEEN FIXED #####
                            publishHTML(target: [
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'Playwright Report'
                            ])
                            sh "docker stop xportal-test-${BUILD_NUMBER} && docker rm xportal-test-${BUILD_NUMBER}"
                        }
                    }
                }
                
                stage('Newman API Tests') {
                    when { expression { fileExists('newman') } }
                    steps {
                        script {
                            echo "=== Running Newman API tests ==="
                            // Call Supabase Edge Functions using configured SUPABASE_URL
                            sh """
                                newman run newman/*.json \
                                  --env-var BASE_URL=\"${SUPABASE_URL}\" \
                                  --reporters cli,htmlextra \
                                  --reporter-htmlextra-export newman-report.html || true
                            """
                        }
                    }
                    post {
                        always {
                            // ##### THIS BLOCK HAS BEEN FIXED #####
                            publishHTML(target: [
                                allowMissing: true, // allowMissing is useful here in case tests don't run
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: '.',
                                reportFiles: 'newman-report.html',
                                reportName: 'Newman API Report'
                            ])
                        }
                    }
                }
                
                stage('Lint & Format Check') {
                    steps {
                        sh 'npm run lint'
                        // Do not fail the pipeline on formatting differences
                        sh 'npx prettier --check . || true'
                    }
                }
            }
        }
        
        stage('📊 Code Quality Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \\
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \\
                                -Dsonar.sources=. \\
                                -Dsonar.host.url=${SONAR_HOST_URL} \\
                                -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }
        
        stage('🔒 Security Analysis') {
            parallel {
                stage('NPM Audit') {
                    steps {
                        sh 'npm audit --audit-level=high'
                    }
                }
                
                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '--scan . --format ALL --out ./owasp-reports', odcInstallation: 'OWASP-Dependency-Check'
                    }
                    post {
                        always {
                            publishHTML(target: [
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'owasp-reports',
                                reportFiles: 'dependency-check-report.html',
                                reportName: 'OWASP Report'
                            ])
                            dependencyCheckPublisher pattern: 'owasp-reports/dependency-check-report.xml'
                        }
                    }
                }
                
                stage('Snyk Security Scan') {
                    steps {
                        sh "snyk auth ${SNYK_TOKEN}"
                        sh 'snyk test --severity-threshold=high --json > snyk-report.json || true'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'snyk-report.json', allowEmptyArchive: true
                        }
                    }
                }
            }
        }
        
        stage('🚀 Deploy to Staging') {
            steps {
                script {
                    echo "=== Deploying to Vercel Staging ==="
                    sh """
                        vercel deploy \\
                            --token ${VERCEL_TOKEN} \\
                            --yes \\
                            --build-env NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL} \\
                            --build-env NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY} \\
                            > staging-url.txt
                    """
                    def stagingUrl = sh(script: 'cat staging-url.txt', returnStdout: true).trim()
                    echo "Deployed to Staging: ${stagingUrl}"
                    currentBuild.description = "${currentBuild.description} | Staging: ${stagingUrl}"
                }
            }
        }
        
        stage('✅ Integration Tests - Staging') {
            steps {
                script {
                    echo "=== Running integration tests on staging environment ==="
                    def stagingUrl = sh(script: 'cat staging-url.txt', returnStdout: true).trim()
                    
                    sh "sleep 15"
                    
                    sh """
                        PLAYWRIGHT_TEST_BASE_URL=${stagingUrl} npm run test:ci
                    """
                }
            }
        }

        stage('릴리스 Release to Production') {
            steps {
                script {
                    input "Promote build #${BUILD_NUMBER} to Production?"
                    
                    echo "=== Releasing to Vercel Production ==="
                    sh """
                        vercel deploy --prod \\
                            --token ${VERCEL_TOKEN} \\
                            --yes \\
                            --build-env NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL} \\
                            --build-env NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY} \\
                            > production-url.txt
                    """
                    def prodUrl = sh(script: 'cat production-url.txt', returnStdout: true).trim()
                    echo "✅ Released to Production: ${prodUrl}"
                    currentBuild.description = "${currentBuild.description} | Production: ${prodUrl}"
                }
            }
        }

        stage('🩺 Monitor Production') {
            steps {
                script {
                    echo "=== Monitoring production application health ==="
                    def prodUrl = sh(script: 'cat production-url.txt', returnStdout: true).trim()
                    
                    sh "sleep 20"
                    
                    echo "Checking /api/health endpoint..."
                    sh "curl -f ${prodUrl}/api/health"
                    
                    echo "Checking /api/metrics endpoint..."
                    sh "curl -f ${prodUrl}/api/metrics"
                    
                    echo "✅ Production application is healthy and serving metrics."
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
            cleanWs()
        }
        success {
            echo "✅ Build successful!"
        }
        failure {
            echo "❌ Build failed. Please check the logs."
        }
    }
}