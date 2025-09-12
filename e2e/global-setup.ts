import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the login page
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if we're already on a login form or need to navigate to it
    const hasLoginForm =
      (await page
        .locator('input[type="email"], input[name="email"], [data-testid="email-input"]')
        .count()) > 0;

    if (!hasLoginForm) {
      // Try to find and click a login/sign-in button
      const loginButton = page
        .locator(
          'button:has-text("Login"), button:has-text("Sign In"), a:has-text("Login"), a:has-text("Sign In")'
        )
        .first();
      if ((await loginButton.count()) > 0) {
        await loginButton.click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Look for email input with various selectors
    const emailInput = page
      .locator(
        'input[type="email"], input[name="email"], input[placeholder*="email" i], [data-testid="email-input"]'
      )
      .first();
    const passwordInput = page
      .locator('input[type="password"], input[name="password"], [data-testid="password-input"]')
      .first();

    if ((await emailInput.count()) > 0 && (await passwordInput.count()) > 0) {
      // Use test credentials (you may need to set these as environment variables)
      const testEmail = process.env.TEST_EMAIL || 'test@example.com';
      const testPassword = process.env.TEST_PASSWORD || 'testpassword123';

      await emailInput.fill(testEmail);
      await passwordInput.fill(testPassword);

      // Look for submit button
      const submitButton = page
        .locator(
          'button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Submit")'
        )
        .first();
      if ((await submitButton.count()) > 0) {
        await submitButton.click();

        // Wait for navigation or success indicator
        try {
          await page.waitForURL(
            (url) => !url.pathname.includes('login') && !url.pathname.includes('auth'),
            { timeout: 10000 }
          );
        } catch {
          // If URL doesn't change, look for dashboard/home elements that indicate successful login
          await page.waitForSelector('[data-testid="dashboard"], .dashboard, #dashboard, main', {
            timeout: 5000,
          });
        }
      }
    }

    // Save the authenticated state
    await page.context().storageState({ path: 'e2e/auth-state.json' });
    console.log('Authentication state saved successfully');
  } catch (error) {
    console.warn('Authentication setup failed, tests will run unauthenticated:', error.message);
    // Still save the current state (might be useful for login screen tests)
    await page.context().storageState({ path: 'e2e/auth-state.json' });
  } finally {
    await browser.close();
  }
}

export default globalSetup;
