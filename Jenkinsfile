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
        NODE_VERSION = '18'
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
        // dockerTool 'docker' // Docker is usually available on the agent path
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
                            
                            // Use a docker container for a clean test environment
                            sh "docker run -d --name xportal-test-${BUILD_NUMBER} -p 3000:3000 ${APP_NAME}:${BUILD_NUMBER}"
                            
                            // Wait for server to be ready
                            sh '''
                                for i in {1..30}; do
                                    if curl -s http://localhost:3000/api/health > /dev/null; then
                                        echo "✅ Test container is ready"
                                        break
                                    fi
                                    echo "Waiting for container... ($i/30)"
                                    sleep 2
                                done
                            '''
                            
                            sh 'npm run test:ci'
                        }
                    }
                    post {
                        always {
                            junit 'test-results/**/*.xml'
                            publishHTML(reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Report')
                            sh "docker stop xportal-test-${BUILD_NUMBER} && docker rm xportal-test-${BUILD_NUMBER}"
                        }
                    }
                }
                
                stage('Newman API Tests') {
                    when { expression { fileExists('newman') } }
                    steps {
                        script {
                            echo "=== Running Newman API tests ==="
                            sh '''
                                # Start server in background
                                npm start &
                                SERVER_PID=$!
                                sleep 15 // Give it time to start
                                
                                newman run newman/*.json --reporters cli,htmlextra --reporter-htmlextra-export newman-report.html || true
                                
                                kill $SERVER_PID || true
                            '''
                        }
                    }
                    post {
                        always {
                            publishHTML(reportDir: '.', reportFiles: 'newman-report.html', reportName: 'Newman API Report', allowMissing: true)
                        }
                    }
                }
                
                stage('Lint & Format Check') {
                    steps {
                        sh 'npm run lint'
                        sh 'npx prettier --check .'
                    }
                }
            }
        }
        
        stage('📊 Code Quality Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    def scannerHome = tool 'SonarScanner'
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
        
        stage('🔒 Security Analysis') {
            parallel {
                stage('NPM Audit') {
                    steps {
                        sh 'npm audit --audit-level=high'
                    }
                }
                
                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '--scan . --format ALL --out ./owasp-reports', odcInstallation: 'Default'
                    }
                    post {
                        always {
                            publishHTML(reportDir: 'owasp-reports', reportFiles: 'dependency-check-report.html', reportName: 'OWASP Report')
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
                    
                    // Wait for deployment to be ready
                    sh "sleep 15"
                    
                    // Run Playwright tests against the live staging URL
                    sh """
                        PLAYWRIGHT_TEST_BASE_URL=${stagingUrl} npm run test:ci
                    """
                }
            }
        }

        // ADDED: Release stage with manual approval gate
        stage('릴리스 Release to Production') {
            steps {
                script {
                    // This manual gate is crucial for a controlled release process
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

        // ADDED: Monitoring stage to check the health of the production application
        stage('🩺 Monitor Production') {
            steps {
                script {
                    echo "=== Monitoring production application health ==="
                    def prodUrl = sh(script: 'cat production-url.txt', returnStdout: true).trim()
                    
                    // Give the production deployment a moment to be fully available
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

    // ADDED: Final post-build actions for cleanup and notifications
    post {
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
            cleanWs() // Cleans up the workspace to save disk space
        }
        success {
            echo "✅ Build successful!"
            // You could add email or Slack notifications here
        }
        failure {
            echo "❌ Build failed. Please check the logs."
            // You could add email or Slack notifications here
        }
    }
}