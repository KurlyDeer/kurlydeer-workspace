import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './test/browser',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    launchOptions: process.env.PLAYWRIGHT_CHROME_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {},
  },
  webServer: {
    command: 'npm run dev -- --port 4173 --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    env: { VITE_SUPABASE_URL: 'http://127.0.0.1:54321', VITE_SUPABASE_ANON_KEY: 'test-public-key', VITE_WEB3FORMS_ACCESS_KEY: 'test-contact-key' },
    reuseExistingServer: false,
  },
});
