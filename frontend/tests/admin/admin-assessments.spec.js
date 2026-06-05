import { test, expect } from '@playwright/test';

test('admin assessments page tampil', async ({ page }) => {
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

  // ADMIN ASSESSMENTS PAGE
  await page.goto(
    'http://localhost:5173/admin/assessments'
  );

  // cek url
  await expect(page).toHaveURL(
    /admin\/assessments/
  );

  // tunggu halaman load
  await page.waitForLoadState(
    'networkidle'
  );

  // CEK HEADING HALAMAN
  await expect(
    page.locator('h1, h2').first()
  ).toBeVisible();

 
  // CEK DATA ASSESSMENT
  await expect(
    page.locator('table, .grid, .card').first()
  ).toBeVisible();


  // CEK SEARCH ASSESSMENT
  const searchInput = page.locator(
    'input[type="text"]'
  ).first();

  if (await searchInput.isVisible()) {

    await searchInput.fill('assessment');

    await expect(
      searchInput
    ).toHaveValue('assessment');
  }

  // SCREENSHOT
  await page.screenshot({
    path: 'admin-assessments-page.png',
    fullPage: true
  });

});