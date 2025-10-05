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
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Invalid login credentials')).toBeVisible();
  });

  test('should navigate to password reset page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL('/auth/reset-password');
  });

  test('should show confirmation after requesting password reset', async ({
    page,
  }) => {
    await page.goto('/auth/reset-password');
    await page.getByLabel('Email').fill('shshwtsuthar@gmail.com');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/auth/reset-password/confirm');
  });
});
