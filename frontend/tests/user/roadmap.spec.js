import { test, expect } from '@playwright/test';

test('roadmap dan roadmap detail tampil', async ({ page }) => {
  // LOGIN
  await page.goto('/login');

  await page.fill('input[type="email"]', 'fahrezireza26@gmail.com');
  await page.fill('input[type="password"]', '123456');

  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard');

  // pastikan benar-benar login
  await expect(page).toHaveURL(/dashboard/);

  // ROADMAP PAGE
  await page.goto('/roadmap');

  await expect(page).toHaveURL(/roadmap/);

  await page.waitForLoadState('networkidle');

  await page.screenshot({
    path: 'roadmap-page.png',
    fullPage: true
  });

  // CLICK ROADMAP ITEM (lebih aman)

  // ❗ GANTI INI kalau ada text/selector spesifik
  const roadmapItem = page.locator('a, button').filter({
    hasText: /roadmap|career|level|path/i
  }).first();

  await expect(roadmapItem).toBeVisible();

  await roadmapItem.click();

  // ROADMAP DETAIL
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/roadmap/);

  await page.screenshot({
    path: 'roadmap-detail.png',
    fullPage: true
  });
});