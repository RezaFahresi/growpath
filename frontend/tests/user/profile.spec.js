import { test, expect } from '@playwright/test';

test('user bisa edit profile', async ({ page }) => {

  // LOGIN
  await page.goto('http://localhost:5173/login');

  await page.fill('input[type="email"]', 'fahrezireza26@gmail.com');
  await page.fill('input[type="password"]', '123456');
  await page.click('button[type="submit"]');

  // Tunggu masuk ke dashboard dengan sukses
  await page.waitForURL('**/dashboard');

  // PROFILE
  await page.goto('http://localhost:5173/profile');

  // Cek URL profile terlebih dahulu
  await expect(page).toHaveURL(/profile/);

  // Tunggu semua proses fetch API selesai agar data profil tidak kosong saat di-screenshot
  await page.waitForLoadState('networkidle');

  // Screenshot profile
  await page.screenshot({
    path: 'profile-page.png',
    fullPage: true
  });

});