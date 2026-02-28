import { Queue, Worker } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST ?? 'redis',
  port: Number(process.env.REDIS_PORT ?? 6379)
};

export const payrollQueue = new Queue('payroll-jobs', { connection });

export const payrollWorker = new Worker(
  'payroll-jobs',
  async (job) => {
    if (job.name === 'generate-payroll') {
      return { status: 'ok', processedAt: new Date().toISOString() };
    }
    return { status: 'ignored' };
  },
  { connection }
);
