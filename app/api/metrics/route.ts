import { NextResponse } from 'next/server';

// Simple in-memory metrics store
const metrics = {
  requests: 0,
  errors: 0,
  latency: [] as number[],
};

export async function GET() {
  const memUsage = process.memoryUsage();
  
  const prometheusMetrics = `
# HELP xportal_up Application is up
# TYPE xportal_up gauge
xportal_up 1

# HELP xportal_requests_total Total number of requests
# TYPE xportal_requests_total counter
xportal_requests_total ${metrics.requests}

# HELP xportal_errors_total Total number of errors
# TYPE xportal_errors_total counter
xportal_errors_total ${metrics.errors}

# HELP xportal_uptime_seconds Application uptime in seconds
# TYPE xportal_uptime_seconds gauge
xportal_uptime_seconds ${process.uptime()}

# HELP xportal_memory_heap_used_bytes Heap memory used in bytes
# TYPE xportal_memory_heap_used_bytes gauge
xportal_memory_heap_used_bytes ${memUsage.heapUsed}

# HELP xportal_memory_heap_total_bytes Total heap memory in bytes
# TYPE xportal_memory_heap_total_bytes gauge
xportal_memory_heap_total_bytes ${memUsage.heapTotal}

# HELP xportal_memory_rss_bytes RSS memory in bytes
# TYPE xportal_memory_rss_bytes gauge
xportal_memory_rss_bytes ${memUsage.rss}

# HELP xportal_nodejs_version_info Node.js version
# TYPE xportal_nodejs_version_info gauge
xportal_nodejs_version_info{version="${process.version}"} 1
`;

  return new NextResponse(prometheusMetrics, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
    },
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  if (data.type === 'request') {
    metrics.requests++;
  } else if (data.type === 'error') {
    metrics.errors++;
  }
  
  if (typeof data.latency === 'number') {
    metrics.latency.push(data.latency);
    // Keep only last 100 latency measurements
    if (metrics.latency.length > 100) {
      metrics.latency.shift();
    }
  }
  
  return NextResponse.json({ success: true });
}


