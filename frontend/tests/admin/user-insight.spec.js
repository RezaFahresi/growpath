import { test, expect } from '@playwright/test';

test('admin users page tampil', async ({ page }) => {
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
  // ADMIN USERS PAGE
  await page.goto(
    'http://localhost:5173/admin/users'
  );

  // cek url
  await expect(page).toHaveURL(
    /admin\/users/
  );

  // tunggu load
  await page.waitForLoadState(
    'networkidle'
  );
 
  // CEK HALAMAN USERS
  await expect(
    page.locator('h1, h2').first()
  ).toBeVisible();

  
  // CEK TABLE / DATA USER
  await expect(
    page.locator('table, .grid, .card').first()
  ).toBeVisible();

  // SEARCH USER
  const searchInput = page.locator(
    'input[type="text"]'
  ).first();

  if (await searchInput.isVisible()) {

    await searchInput.fill('reza');

    await expect(
      searchInput
    ).toHaveValue('reza');
  }

  // SCREENSHOT
  await page.screenshot({
    path: 'admin-users-page.png',
    fullPage: true
  });

});