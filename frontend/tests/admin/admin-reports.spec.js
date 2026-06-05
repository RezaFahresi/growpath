import { test, expect } from '@playwright/test';

test('admin reports page tampil', async ({ page }) => {
  // LOGIN ADMIN
  await page.goto('http://localhost:5173/login-admin');

  await page.fill(
    'input[type="email"]',
    'superadmin@growpath.com'
  );

  await page.fill(
    'input[type="password"]',
    'admin123'
  );

  await page.click(
    'button[type="submit"]'
  );

  // tunggu dashboard admin
  await page.waitForURL(
    '**/admin/dashboard'
  );

  // ADMIN REPORTS PAGE
  await page.goto(
    'http://localhost:5173/admin/reports'
  );

  // cek url
  await expect(page).toHaveURL(
    /admin\/reports/
  );

  // tunggu halaman load
  await page.waitForLoadState(
    'networkidle'
  );

  // CEK HEADING HALAMAN
  await expect(
    page.locator('h1, h2').first()
  ).toBeVisible();

  // CEK DATA REPORT
  await expect(
    page.locator('table, .grid, .card, canvas').first()
  ).toBeVisible();


  // SCREENSHOT
  await page.screenshot({
    path: 'admin-reports-page.png',
    fullPage: true
  });

});