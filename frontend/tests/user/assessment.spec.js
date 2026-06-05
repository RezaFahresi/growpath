import { test, expect } from '@playwright/test';

test('assessment pages tampil', async ({ page }) => {
  // LOGIN
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'fahrezireza26@gmail.com');
  await page.fill('input[type="password"]', '123456');
  await page.click('button[type="submit"]');
  // tunggu redirect login berhasil
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // pastikan token benar-benar ada (INI PENTING)
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).not.toBeNull();

  // ASSESSMENT LIST
  await page.goto('http://localhost:5173/assessment');

  // jangan pakai regex yang salah
  await expect(page).toHaveURL(/assessment/);

  // ASSESSMENT TAKE
  await page.goto('http://localhost:5173/assessment/take/1');

  await expect(page).toHaveURL(/assessment\/take/);

  // ASSESSMENT RESULT
  await page.goto('http://localhost:5173/assessment/result');

  await expect(page).toHaveURL(/assessment\/result/);
});