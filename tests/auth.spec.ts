import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect to login when accessing protected route', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    expect(page.url()).toContain('/login');
  });

  test('should show error message with invalid credentials', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByTestId('email').fill('invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Invalid login credentials')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email').fill('shshwtsuthar@gmail.com');
    await page.fill('input[name="password"]', '$ha$hw1T$uthar');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to password reset page', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('forgot-password').click();
    await expect(page).toHaveURL('/auth/reset-password');
  });

  test('should show confirmation after requesting password reset', async ({
    page,
  }) => {
    await page.goto('/auth/reset-password');
    await page.fill('input[name="email"]', 'shshwtsuthar@gmail.com');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/auth/reset-password/confirm');
  });

  test('should allow admin to access user management', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByTestId('email').fill('shshwtsuthar@gmail.com');
    await page.fill('input[name="password"]', '$ha$hw1T$uthar');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Navigate to users page
    await page.goto('/users');
    await expect(page).toHaveURL('/users');
    await expect(page.getByText('User Management')).toBeVisible();
  });

  test('should show invite user dialog', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'shshwtsuthar@gmail.com');
    await page.fill('input[name="password"]', '$ha$hw1T$uthar');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Navigate to users page and wait for it to load
    await page.goto('/users');
    await page.waitForLoadState('networkidle');

    // Wait for the button to be visible and clickable
    await page.waitForSelector('button:has-text("Invite User")', {
      state: 'visible',
    });
    await page.click('button:has-text("Invite User")');

    // Wait for dialog to open
    await expect(page.getByText('Invite New User')).toBeVisible();
  });
});
