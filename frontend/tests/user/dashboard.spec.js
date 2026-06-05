import { test, expect } from '@playwright/test';

test('dashboard tampil', async ({ page }) => {

  // 1. Buka halaman login
  await page.goto('http://localhost:5173/login');

  // 2. Isi form dan klik login
  await page.fill('input[type="email"]', 'fahrezireza26@gmail.com');
  await page.fill('input[type="password"]', '123456');
  await page.click('button[type="submit"]');

  
  await page.waitForURL('**/dashboard');

  // 4. Cek URL Dashboard
  await expect(page).toHaveURL(/dashboard/);

  await expect(page.locator('body')).toBeVisible();

  // 6. Screenshot dashboard
  await page.screenshot({
    path: 'dashboard.png',
    fullPage: true
  });

});