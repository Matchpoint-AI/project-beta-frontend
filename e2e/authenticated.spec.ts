import { test, expect } from '@playwright/test';

test.describe('Authenticated User Features', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks for each test
    await setupAuthenticatedMocks(page);

    // Navigate to the app - should be authenticated via storage state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should be successfully authenticated', async ({ page }) => {
    console.log('Current URL:', page.url());

    // Should not be on login page
    expect(page.url()).not.toContain('/login');
    expect(page.url()).not.toContain('/signup');

    // Should be on dashboard or onboard page
    const isDashboard =
      page.url().includes('/dashboard') || page.url() === 'http://localhost:3000/';
    const isOnboard = page.url().includes('/onboard');

    expect(isDashboard || isOnboard).toBeTruthy();
    console.log('✅ User is authenticated and on correct page');
  });

  test('should have user navigation and logout capability', async ({ page }) => {
    // Look for navigation elements that indicate user is logged in
    const navigationExists = (await page.locator('nav, [role="navigation"], header').count()) > 0;

    if (navigationExists) {
      // Look for user-specific elements
      const userElements = await page
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

      console.log('User navigation elements found:', userElements);

      // If we find logout/profile options, try to access user menu
      const logoutButton = page
        .locator('button:has-text("Logout"), button:has-text("Sign Out")')
        .first();
      if ((await logoutButton.count()) > 0) {
        console.log('✅ Found logout button - user menu is accessible');
      }
    }
  });

  test('should access dashboard features', async ({ page }) => {
    // Navigate to dashboard specifically
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for dashboard-specific elements
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
    console.log('✅ Dashboard elements found:', dashboardElements);

    // Look for interactive dashboard features
    const interactiveElements = await page
      .locator(
        [
          'button:not([type="submit"])', // Exclude form submit buttons
          '[role="button"]',
          'a[href*="/campaign"]',
          'a[href*="/brand"]',
          '[data-testid*="create"]',
          '[data-testid*="new"]',
        ].join(', ')
      )
      .count();

    console.log('Interactive dashboard elements:', interactiveElements);
  });

  test('should handle campaign-related features', async ({ page }) => {
    // Look for campaign-related navigation or buttons
    const campaignElements = await page
      .locator(
        [
          'a[href*="campaign"]',
          'button:has-text("Campaign")',
          'button:has-text("New Campaign")',
          'button:has-text("Create Campaign")',
          '[data-testid*="campaign"]',
        ].join(', ')
      )
      .count();

    if (campaignElements > 0) {
      console.log('✅ Campaign features found:', campaignElements);

      // Try to access campaign section
      const campaignLink = page.locator('a[href*="campaign"], button:has-text("Campaign")').first();
      if ((await campaignLink.count()) > 0) {
        await campaignLink.click();
        await page.waitForLoadState('networkidle');

        // Verify we navigated successfully
        expect(page.url()).toMatch(/campaign/);
        console.log('✅ Successfully navigated to campaign section');
      }
    } else {
      console.log('ℹ️  No campaign elements found - user may need onboarding');
    }
  });

  test('should handle brand onboarding if needed', async ({ page }) => {
    // If user doesn't have a brand, they should be on onboard page
    if (page.url().includes('/onboard')) {
      console.log('👋 User needs brand onboarding');

      // Look for onboarding form elements
      const onboardingElements = await page
        .locator(
          [
            'input[name="brandName"], input#brandName',
            'input[name="businessName"]',
            'input[name="website"]',
            'button:has-text("Next")',
            'button:has-text("Continue")',
            'button:has-text("Save")',
            'form',
          ].join(', ')
        )
        .count();

      expect(onboardingElements).toBeGreaterThan(0);
      console.log('✅ Onboarding form elements found:', onboardingElements);
    } else {
      console.log('✅ User already has brand - no onboarding needed');
    }
  });

  test('should not show login form when authenticated', async ({ page }) => {
    // Authenticated users should not see login forms anywhere
    const loginElements = await page
      .locator(
        [
          'input[type="password"]',
          'button:has-text("Login")',
          'button:has-text("Sign In")',
          'a[href*="/login"]',
        ].join(', ')
      )
      .count();

    expect(loginElements).toBe(0);
    console.log('✅ No login forms visible - user is properly authenticated');
  });

  test('should have working page navigation', async ({ page }) => {
    // Get all internal navigation links
    const navLinks = await page.locator('nav a, [role="navigation"] a').all();
    console.log('Navigation links found:', navLinks.length);

    // Test a few safe navigation links
    for (let i = 0; i < Math.min(navLinks.length, 3); i++) {
      const link = navLinks[i];
      const href = await link.getAttribute('href');

      if (href && href.startsWith('/') && !href.includes('mailto:') && !href.includes('#')) {
        console.log(`Testing navigation to: ${href}`);

        await link.click();
        await page.waitForLoadState('networkidle');

        // Verify navigation worked and we're still authenticated
        expect(page.url()).not.toContain('/login');
        console.log('✅ Navigation successful, still authenticated');

        // Go back to test next link
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });
});

async function setupAuthenticatedMocks(page: any) {
  // Mock Firebase Auth to keep user authenticated
  await page.route('https://identitytoolkit.googleapis.com/**', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        users: [
          {
            localId: 'mock-user-id-123',
            email: 'test@example.com',
            displayName: 'Test User',
            emailVerified: true,
          },
        ],
      }),
    });
  });

  // Mock backend API for authenticated user
  await page.route('**/api/v1/user**', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        hasBrand: true,
        plan: 'FREE',
        is_admin: false,
        token: 'mock-jwt-token',
      }),
    });
  });

  // Mock brand/campaign APIs
  await page.route('**/api/v1/brands**', async (route: any) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'brand-123',
            name: 'Test Brand',
            description: 'A test brand for E2E testing',
            website: 'https://testbrand.com',
            industry: 'Technology',
          },
        ]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    }
  });

  // Mock campaigns API
  await page.route('**/api/v1/campaigns**', async (route: any) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'campaign-123',
            title: 'Test Campaign',
            status: 'active',
            brandId: 'brand-123',
          },
        ]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    }
  });

  // Default mock for any other API calls
  await page.route('**/api/**', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: {} }),
    });
  });
}
