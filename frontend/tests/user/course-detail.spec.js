import { test, expect } from '@playwright/test';

test('course detail tampil lengkap', async ({ page }) => {

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

  // COURSE DETAIL PAGE
  await page.goto(
    'http://localhost:5173/courses/1'
  );

  // cek url
  await expect(page).toHaveURL(
    /courses\/1/
  );

  // tunggu halaman selesai load
  await page.waitForLoadState('networkidle');

  // CEK JUDUL COURSE
  await expect(
    page.locator('h1')
  ).toBeVisible();

 
  // CEK DESCRIPTION
  await expect(
    page.getByText(/Description/i)
  ).toBeVisible();

  // CEK VIDEO CONTAINER
  await expect(
    page.locator('.aspect-video')
  ).toBeVisible();

  // CEK COURSE CONTENT
  await expect(
    page.getByText(/Course Content/i)
  ).toBeVisible();

  // CEK LESSON / MODULE
  await expect(
    page.getByText(/Lesson|Module/i).first()
  ).toBeVisible();

  // SCREENSHOT
  await page.screenshot({
    path: 'course-detail-page.png',
    fullPage: true
  });

});