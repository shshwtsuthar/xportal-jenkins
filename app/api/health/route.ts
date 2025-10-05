import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    // Query a known table from the schema to validate DB connectivity
    const { error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      build: process.env.BUILD_NUMBER || 'local',
      services: {
        database: error ? 'unhealthy' : 'healthy',
        api: 'healthy',
      },
    } as const;
    
    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}


