import { test, expect } from '@playwright/test';

test('admin pages tampil dan fungsionalitas CRUD', async ({ page }) => {

  // Helper Locator: Membidik input teks/email yang tampil di layar
  const visibleTextInputs = page.locator('input[type="text"]:visible, input[type="email"]:visible, input:not([type]):visible');

  // =========================
  // LOGIN ADMIN
  // =========================
  await page.goto('http://localhost:5173/login-admin');

  await visibleTextInputs.first().fill('superadmin@growpath.com');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.locator('button:has-text("Login"), button:has-text("Masuk")').first().click();

  await page.waitForURL('**/admin/dashboard');
  await expect(page).toHaveURL(/admin\/dashboard/);
  await page.screenshot({ path: 'admin-dashboard.png', fullPage: true });


  // =========================
  // MANAGE ASSESSMENT
  // =========================
  await page.goto('http://localhost:5173/admin/assessment');
  await page.waitForLoadState('networkidle'); 
  
  // Create
  await page.getByText(/Tambah|Add/i).first().click();
  await page.waitForTimeout(1000); 
  await visibleTextInputs.last().fill('Assessment Test QA');
  // Amankan penyimpanan dengan menekan tombol secara eksplisit, bukan Enter
  await page.locator('button:has-text("Simpan"), button:has-text("Save"), button:has-text("Submit"), button:has-text("Tambah")').last().click();
  await page.waitForTimeout(1500); 
  
  // Search (Kolom pencarian selalu menjadi input teks pertama di halaman Admin setelah modal tutup)
  await visibleTextInputs.first().fill('Assessment Test QA');
  await page.waitForTimeout(1000); 
  await expect(page.getByText('Assessment Test QA').first()).toBeVisible();
  
  // Update
  await page.locator('tr').filter({ hasText: 'Assessment Test QA' }).getByText(/Edit|Ubah/i).first().click();
  await page.waitForTimeout(1000);
  await visibleTextInputs.last().fill('Assessment Test QA Updated');
  await page.locator('button:has-text("Simpan"), button:has-text("Save"), button:has-text("Update"), button:has-text("Perbarui")').last().click();
  await page.waitForTimeout(1500);
  
  // Delete
  await page.locator('tr').filter({ hasText: 'Assessment Test QA Updated' }).getByText(/Hapus|Delete/i).first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Ya"), button:has-text("Hapus"), button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Ok")').first().click();
  await page.waitForTimeout(1000);


  // =========================
  // MANAGE COURSES (CAREER PATH)
  // =========================
  await page.goto('http://localhost:5173/admin/courses');
  await page.waitForLoadState('networkidle');

  // Create
  await page.getByText(/Tambah|Add/i).first().click();
  await page.waitForTimeout(1000);
  await visibleTextInputs.last().fill('Career Path Frontend');
  await page.locator('button:has-text("Simpan"), button:has-text("Save"), button:has-text("Submit"), button:has-text("Tambah")').last().click();
  await page.waitForTimeout(1500);
  
  // Search
  await visibleTextInputs.first().fill('Career Path Frontend');
  await page.waitForTimeout(1000);
  await expect(page.getByText('Career Path Frontend').first()).toBeVisible();
  
  // Update
  await page.locator('tr').filter({ hasText: 'Career Path Frontend' }).getByText(/Edit|Ubah/i).first().click();
  await page.waitForTimeout(1000);
  await visibleTextInputs.last().fill('Career Path Fullstack');
  await page.locator('button:has-text("Simpan"), button:has-text("Save"), button:has-text("Update"), button:has-text("Perbarui")').last().click();
  await page.waitForTimeout(1500);
  
  // Delete
  await page.locator('tr').filter({ hasText: 'Career Path Fullstack' }).getByText(/Hapus|Delete/i).first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Ya"), button:has-text("Hapus"), button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Ok")').first().click();
  await page.waitForTimeout(1000);


  // =========================
  // MANAGE TALENT MAPPING
  // =========================
  await page.goto('http://localhost:5173/admin/talent-mapping');
  await page.waitForLoadState('networkidle');

  // Create
  await page.getByText(/Tambah|Add/i).first().click();
  await page.waitForTimeout(1000);
  await visibleTextInputs.last().fill('Talent Map QA Engineer');
  await page.locator('button:has-text("Simpan"), button:has-text("Save"), button:has-text("Submit"), button:has-text("Tambah")').last().click();
  await page.waitForTimeout(1500);
  
  // Search
  await visibleTextInputs.first().fill('Talent Map QA Engineer');
  await page.waitForTimeout(1000);
  await expect(page.getByText('Talent Map QA Engineer').first()).toBeVisible();
  
  // Update
  await page.locator('tr').filter({ hasText: 'Talent Map QA Engineer' }).getByText(/Edit|Ubah/i).first().click();
  await page.waitForTimeout(1000);
  await visibleTextInputs.last().fill('Talent Map SDET');
  await page.locator('button:has-text("Simpan"), button:has-text("Save"), button:has-text("Update"), button:has-text("Perbarui")').last().click();
  await page.waitForTimeout(1500);
  
  // Delete
  await page.locator('tr').filter({ hasText: 'Talent Map SDET' }).getByText(/Hapus|Delete/i).first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Ya"), button:has-text("Hapus"), button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Ok")').first().click();
  await page.waitForTimeout(1000);


  // =========================
  // MANAGE USER
  // =========================
  await page.goto('http://localhost:5173/admin/user');
  await page.waitForLoadState('networkidle');

  // Create
  await page.getByText(/Tambah|Add/i).first().click();
  await page.waitForTimeout(1000);
  await visibleTextInputs.nth(-2).fill('Talent Baru'); 
  await visibleTextInputs.last().fill('newtalent@growpath.com');
  await page.locator('button:has-text("Simpan"), button:has-text("Save"), button:has-text("Submit"), button:has-text("Tambah")').last().click();
  await page.waitForTimeout(1500);
  
  // Search
  await visibleTextInputs.first().fill('newtalent@growpath.com');
  await page.waitForTimeout(1000);
  await expect(page.getByText('newtalent@growpath.com').first()).toBeVisible();
  
  // Update
  await page.locator('tr').filter({ hasText: 'newtalent@growpath.com' }).getByText(/Edit|Ubah/i).first().click();
  await page.waitForTimeout(1000);
  await visibleTextInputs.nth(-2).fill('Talent Senior Baru');
  await page.locator('button:has-text("Simpan"), button:has-text("Save"), button:has-text("Update"), button:has-text("Perbarui")').last().click();
  await page.waitForTimeout(1500);
  
  // Delete
  await page.locator('tr').filter({ hasText: 'newtalent@growpath.com' }).getByText(/Hapus|Delete/i).first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Ya"), button:has-text("Hapus"), button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Ok")').first().click();
  await page.waitForTimeout(1000);


  // =========================
  // HALAMAN LAINNYA
  // =========================
  await page.goto('http://localhost:5173/register-admin');
  await page.waitForLoadState('networkidle');

  await page.goto('http://localhost:5173/admin/reports');
  await page.waitForLoadState('networkidle');

  await page.goto('http://localhost:5173/admin/settings');
  await page.waitForLoadState('networkidle');

  await page.goto('http://localhost:5173/user-insight');
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: 'admin-pages.png', fullPage: true });

});