import { test, expect } from '@playwright/test';

test('learning progress tampil', async ({ page }) => {
  // LOGIN
  await page.goto('http://localhost:5173/login');

  await page.fill(
    'input[type="email"]',
    'fahrezireza26@gmail.com'
  );

  await page.fill(
    'input[type="password"]',
    '123456'
  );

  await page.click(
    'button[type="submit"]'
  );

  // tunggu dashboard
  await page.waitForURL('**/dashboard');

  // LEARNING PROGRESS PAGE
  await page.goto(
    'http://localhost:5173/progress'
  );

  // cek url
  await expect(page).toHaveURL(
    /progress/
  );

  // tunggu halaman load
  await page.waitForLoadState('networkidle');

  // CEK HEADING HALAMAN
  await expect(
    page.locator('h1, h2').first()
  ).toBeVisible();

  // CEK ADA COURSE / PROGRESS
  await expect(
    page.locator('div').first()
  ).toBeVisible();

  // CEK TEXT PROGRESS
  await expect(
    page.getByText(/progress|completed|ongoing|100%|course/i).first()
  ).toBeVisible();

  // SCREENSHOT
  await page.screenshot({
    path: 'learning-progress-page.png',
    fullPage: true
  });

});