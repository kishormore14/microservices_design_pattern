import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import axios from 'axios';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const app = express();
app.use(helmet());
app.use(cors({ origin: [/dev\.hrms\.internal$/, /hrms\.internal$/], credentials: true }));
app.use(express.json());
app.use(morgan('combined'));

const rateLimiter = new RateLimiterMemory({ points: 300, duration: 60 });

app.use(async (req: Request, res: Response, next) => {
  try {
    await rateLimiter.consume(req.ip ?? 'unknown');
    next();
  } catch {
    res.status(429).json({ message: 'Too many requests' });
  }
});

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

app.get('/api/v1/employees', async (_req, res) => {
  const base = process.env.EMPLOYEE_SERVICE_URL ?? 'http://localhost:3000';
  const response = await axios.get(`${base}/api/v1/employees`, { timeout: 2000 });
  res.json(response.data);
});

app.listen(process.env.PORT ?? 8081, () => {
  // eslint-disable-next-line no-console
  console.log('API gateway running');
});
