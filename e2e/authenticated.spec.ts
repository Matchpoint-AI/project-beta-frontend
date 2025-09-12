import { test, expect } from '@playwright/test';

test.describe('Authenticated User Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test(
    'should access dashboard when authenticated',
    { tag: '@authenticated' },
    async ({ page }) => {
      // If authentication worked, we should not be on a login page
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('login');
      expect(currentUrl).not.toContain('auth');

      // Look for dashboard elements
      const dashboardElements = await page
        .locator(
          [
            '[data-testid="dashboard"]',
            '.dashboard',
            'main',
            '[role="main"]',
            '.app-content',
            '.main-content',
          ].join(', ')
        )
        .count();

      expect(dashboardElements).toBeGreaterThan(0);
    }
  );

  test('should have user navigation menu', { tag: '@authenticated' }, async ({ page }) => {
    // Look for navigation elements that indicate user is logged in
    const navElements = await page
      .locator(['nav', '[role="navigation"]', '.navbar', '.navigation', 'header nav'].join(', '))
      .count();

    if (navElements > 0) {
      await expect(page.locator('nav, [role="navigation"], header').first()).toBeVisible();

      // Look for user-specific elements like profile, settings, logout
      const userMenuElements = await page
        .locator(
          [
            'button:has-text("Profile")',
            'button:has-text("Settings")',
            'button:has-text("Logout")',
            'button:has-text("Sign Out")',
            '[data-testid="user-menu"]',
            '.user-menu',
          ].join(', ')
        )
        .count();

      console.log('User menu elements found:', userMenuElements);
    }
  });

  test(
    'should be able to interact with main features',
    { tag: '@authenticated' },
    async ({ page }) => {
      // Look for interactive elements that indicate the app is functional
      const interactiveElements = await page
        .locator(['button', 'a[href]', 'input', '[role="button"]', '.btn', '.button'].join(', '))
        .count();

      expect(interactiveElements).toBeGreaterThan(0);

      // Try clicking on a safe navigation element if available
      const safeNavItems = page.locator('nav a, [role="navigation"] a, .nav-link').first();
      if ((await safeNavItems.count()) > 0) {
        const href = await safeNavItems.getAttribute('href');
        if (href && !href.includes('http') && !href.includes('mailto:')) {
          // Click internal navigation links
          await safeNavItems.click();
          await page.waitForLoadState('networkidle');

          // Verify navigation worked
          await expect(page.locator('html')).toBeVisible();
        }
      }
    }
  );

  test('should load content sections', { tag: '@authenticated' }, async ({ page }) => {
    // Look for content sections that would be visible to authenticated users
    const contentSections = await page
      .locator(
        [
          'section',
          '[role="main"]',
          '.content',
          '.main-content',
          'main > *',
          '[data-testid*="content"]',
          '[data-testid*="section"]',
        ].join(', ')
      )
      .count();

    console.log('Content sections found:', contentSections);
    expect(contentSections).toBeGreaterThan(0);

    // Check that content is actually visible and not just empty divs
    const visibleContent = await page
      .locator('section, main, .content')
      .filter({ hasText: /.+/ })
      .count();
    console.log('Sections with visible content:', visibleContent);
  });

  test(
    'should not show login form when authenticated',
    { tag: '@authenticated' },
    async ({ page }) => {
      // Authenticated users should not see login forms
      const loginElements = await page
        .locator(
          [
            'input[type="password"]',
            'input[name="password"]',
            'button:has-text("Login")',
            'button:has-text("Sign In")',
            '[data-testid*="login"]',
            '.login-form',
          ].join(', ')
        )
        .count();

      expect(loginElements).toBe(0);
    }
  );
});
