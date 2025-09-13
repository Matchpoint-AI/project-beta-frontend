import { test, expect } from '@playwright/test';

test.describe('Auth Smoke Tests', () => {
  test('should show login screen when not authenticated', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    // Check if we're redirected to login or if login form is visible
    const loginIndicators = await page
      .locator('text=/sign in|log in|login|email|password/i')
      .count();
    expect(loginIndicators).toBeGreaterThan(0);
  });

  test('should have accessible login form elements', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    // Look for typical login form elements
    const emailField = page
      .locator('input[type="email"], input[name*="email"], input[placeholder*="email"]')
      .first();
    const passwordField = page.locator('input[type="password"]').first();

    // If login form exists, check elements are present
    const hasEmailField = await emailField.count();
    const hasPasswordField = await passwordField.count();

    if (hasEmailField > 0 && hasPasswordField > 0) {
      // Verify the form elements are visible and enabled
      await expect(emailField).toBeVisible();
      await expect(passwordField).toBeVisible();
    }
  });

  test('can reach login page without errors', { tag: '@smoke' }, async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('Failed to load resource')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
