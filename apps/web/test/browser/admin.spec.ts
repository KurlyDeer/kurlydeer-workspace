import { test, expect, Page } from '@playwright/test';

async function mockBackend(page: Page, role = 'admin', failWrites = false) {
  let rows: any[] = [];
  const user = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', email: 'test@example.com', app_metadata: { role }, user_metadata: {}, created_at: new Date().toISOString() };
  const jwt = [Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'), Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated', app_metadata: { role } })).toString('base64url'), 'test-signature'].join('.');
  await page.route('http://127.0.0.1:54321/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    let data: unknown = {};
    if (url.pathname.includes('/auth/v1/token')) data = { access_token: jwt, refresh_token: 'test-refresh-token', expires_in: 3600, token_type: 'bearer', user };
    else if (url.pathname.includes('/auth/v1/user')) data = user;
    else if (url.pathname.includes('/rest/v1/hub_content')) {
      if (request.method() === 'GET') data = rows.filter(r => !url.searchParams.has('published') || r.published);
      else if (failWrites) return route.fulfill({ status: 409, json: { message: 'Simulated save failure', code: '23505' } });
      else if (request.method() === 'DELETE') {
        const id = url.searchParams.get('id')?.slice(3);
        data = rows.find(r => r.id === id);
        rows = rows.filter(r => r.id !== id);
      } else {
        const row = { ...request.postDataJSON(), updated_at: new Date().toISOString() };
        rows = [row, ...rows.filter(r => r.id !== row.id)];
        data = row;
      }
    } else if (url.pathname.includes('/rest/v1/hub_settings')) data = { id: 1, available: true };
    await route.fulfill({ status: 200, json: data });
  });
}
async function login(page: Page) {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Admin Email').fill('test@example.com');
  await page.getByLabel('Passphrase').fill('test-password');
  await page.getByRole('button', { name: 'Establish Session' }).click();
}

test('signed-out and non-admin accounts cannot enter the editor', async ({ page }) => {
  await mockBackend(page, 'viewer');
  await login(page);
  await expect(page.getByRole('alert')).toContainText('does not have admin access');
  await expect(page).toHaveURL(/\/login$/);
});

test('mobile project create, publish, reload, delete and sign-out', async ({ page }) => {
  await mockBackend(page);
  await login(page);
  await page.getByRole('button', { name: 'New project', exact: true }).click();
  const editor = page.getByRole('dialog', { name: 'Edit project' });
  await editor.getByLabel('Title', { exact: true }).fill('Mobile project');
  await editor.getByLabel('Description', { exact: true }).fill('Edited on a phone');
  await editor.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toHaveText('Draft saved.');
  await page.getByRole('button', { name: 'Edit Mobile project' }).click();
  await editor.getByLabel('Published — visible to everyone').check();
  await editor.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toHaveText('Published successfully.');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Mobile project' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Mobile project' }).click();
  page.once('dialog', dialog => dialog.accept());
  await editor.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Item deleted.');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test('failed saves retain input; mobile drawer and upload validation work at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await mockBackend(page, 'admin', true);
  await login(page);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('dialog', { name: 'Admin navigation' }).getByRole('button', { name: 'Articles' }).click();
  await page.getByRole('button', { name: 'New article' }).click();
  const editor = page.getByRole('dialog', { name: 'Edit article' });
  await editor.getByLabel('Title', { exact: true }).fill('Draft to preserve');
  await editor.getByLabel('Summary', { exact: true }).fill('A summary');
  await editor.getByLabel('Article (Markdown)').fill('Article body');
  await editor.getByRole('button', { name: 'Save changes' }).click();
  await expect(editor.getByRole('alert')).toHaveText('Simulated save failure');
  await expect(editor.getByLabel('Title', { exact: true })).toHaveValue('Draft to preserve');
  await editor.getByLabel('Attach an image or PDF').setInputFiles({ name: 'bad.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') });
  await expect(editor.getByRole('alert')).toContainText('JPEG, PNG, WebP');
  expect(await editor.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: 'test-results/mobile-editor.png', fullPage: true });
});

test('contact submission waits for delivery and preserves input on rejection', async ({ page }) => {
  await mockBackend(page);
  await page.route('https://api.web3forms.com/submit', route => route.fulfill({ status: 400, json: { success: false } }));
  await page.goto('/');
  await page.locator('input[name="name"]').fill('Visitor');
  await page.locator('input[name="email"]').fill('visitor@example.com');
  await page.locator('textarea[name="message"]').fill('Keep this message');
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.getByText('Transmission failed. Please retry.')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toHaveValue('Keep this message');
});
