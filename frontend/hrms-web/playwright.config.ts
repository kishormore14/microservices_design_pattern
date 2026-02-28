import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run start -- --host 127.0.0.1 --port 4200',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4200'
  }
});
