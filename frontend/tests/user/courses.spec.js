import { test, expect } from '@playwright/test';

test('course library tampil dan filter berjalan', async ({ page }) => {
  // LOGIN
  await page.goto('/login');

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

  await expect(page).toHaveURL(
    /dashboard/
  );

  // COURSE LIBRARY PAGE
  await page.goto('/courses');

  await expect(page).toHaveURL(
    /courses/
  );

  // tunggu data tampil
  await page.waitForLoadState('networkidle');

  // screenshot halaman courses
  await page.screenshot({
    path: 'courses-page.png',
    fullPage: true
  });

  // TEST SEARCH COURSE
  const searchInput = page.locator(
    'input[type="text"]'
  ).first();

  await expect(searchInput).toBeVisible();

  // isi pencarian
  await searchInput.fill('frontend');

  // tunggu hasil filter/search
  await page.waitForLoadState('networkidle');

  // screenshot hasil search
  await page.screenshot({
    path: 'courses-search.png',
    fullPage: true
  });


  // TEST FILTER CATEGORY
  const designFilter = page.locator(
    'button, a'
  ).filter({
    hasText: /design/i
  }).first();

  await expect(designFilter).toBeVisible();

  await designFilter.click();

  await page.waitForLoadState('networkidle');

  // screenshot filter design
  await page.screenshot({
    path: 'courses-design-filter.png',
    fullPage: true
  });

  // klik kategori Frontend
  const frontendFilter = page.locator(
    'button, a'
  ).filter({
    hasText: /frontend/i
  }).first();

  await expect(frontendFilter).toBeVisible();

  await frontendFilter.click();

  await page.waitForLoadState('networkidle');

  // screenshot filter frontend
  await page.screenshot({
    path: 'courses-frontend-filter.png',
    fullPage: true
  });

  // klik kategori Backend
  const backendFilter = page.locator(
    'button, a'
  ).filter({
    hasText: /backend/i
  }).first();

  await expect(backendFilter).toBeVisible();

  await backendFilter.click();

  await page.waitForLoadState('networkidle');

  // screenshot filter backend
  await page.screenshot({
    path: 'courses-backend-filter.png',
    fullPage: true
  });

});