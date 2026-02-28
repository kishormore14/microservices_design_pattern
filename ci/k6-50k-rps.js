import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    steady_50k_rps: {
      executor: 'constant-arrival-rate',
      rate: 50000,
      timeUnit: '1s',
      duration: '10m',
      preAllocatedVUs: 5000,
      maxVUs: 30000
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<750', 'p(99)<1200']
  }
};

export default function () {
  const base = __ENV.BASE_URL || 'http://localhost:3000';
  const res = http.get(`${base}/api/v1/employees`, {
    headers: {
      'x-tenant-id': __ENV.TENANT_ID || 'perf'
    },
    timeout: '5s'
  });

  check(res, {
    'status is 200': (r) => r.status === 200
  });
}
