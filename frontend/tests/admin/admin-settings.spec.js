import { test, expect } from '@playwright/test';

test('admin settings page tampil', async ({ page }) => {
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

  // ADMIN SETTINGS PAGE
  await page.goto(
    'http://localhost:5173/admin/settings'
  );

  // cek url
  await expect(page).toHaveURL(
    /admin\/settings/
  );

  // tunggu halaman load
  await page.waitForLoadState(
    'networkidle'
  );

  // CEK HEADING HALAMAN
  await expect(
    page.locator('h1, h2').first()
  ).toBeVisible();

  // CEK FORM / SETTING
  await expect(
    page.locator('form, input, select, textarea').first()
  ).toBeVisible();

  // SCREENSHOT
  await page.screenshot({
    path: 'admin-settings-page.png',
    fullPage: true
  });

});