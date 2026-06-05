import { test, expect } from '@playwright/test';

test('user login berhasil ke dashboard', async ({ page }) => {

  // buka halaman login
  await page.goto('http://localhost:5173/login');

  // isi email
  await page.fill(
    'input[type="email"]',
    'fahrezireza26@gmail.com'
  );

  // isi password
  await page.fill(
    'input[type="password"]',
    '123456'
  );

  // klik tombol login
  await page.click(
    'button[type="submit"]'
  );

  // tunggu redirect
  await page.waitForTimeout(5000);

  // cek berhasil masuk dashboard
  await expect(page).toHaveURL(
    /dashboard/
  );

  // screenshot hasil login
  await page.screenshot({
    path: 'login-success.png',
    fullPage: true
  });

});