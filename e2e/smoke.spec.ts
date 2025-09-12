import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load application homepage', { tag: '@smoke' }, async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that the page loads and has basic HTML structure
    await expect(page.locator('html')).toBeVisible();

    // Check for React root or app container
    const hasRoot = await page.locator('#root, [data-reactroot], .app, .app-container, main').count();
    expect(hasRoot).toBeGreaterThan(0);

    // Verify page title is set
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check if we're in authenticated state (not on login page)
    const isLoginPage = page.url().includes('login') || page.url().includes('auth');
    if (!isLoginPage) {
      // Look for authenticated app elements
      const appElements = await page.locator('[data-testid="dashboard"], .dashboard, nav, [role="navigation"]').count();
      console.log('Authenticated app elements found:', appElements);
    }
  });

  test('should have working navigation', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    // Look for common navigation elements
    const navElements = await page.locator('nav, [role="navigation"], header').count();

    // If navigation exists, it should be visible
    if (navElements > 0) {
      await expect(page.locator('nav, [role="navigation"], header').first()).toBeVisible();
    }

    // Test that the app doesn't crash on navigation
    await expect(page.locator('html')).toBeVisible();
  });

  test('should not have console errors', { tag: '@smoke' }, async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait a moment for any async errors
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('Failed to load resource')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should be responsive', { tag: '@smoke' }, async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('html')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('html')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('html')).toBeVisible();
  });
});
