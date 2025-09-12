import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/auth-state.json';

setup('authenticate', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  // Check if we're already on a login form or need to navigate to it
  const hasLoginForm =
    (await page
      .locator('input[type="email"], input[name="email"], [data-testid="email-input"]')
      .count()) > 0;

  if (!hasLoginForm) {
    console.log('No login form found, looking for login button...');
    // Try to find and click a login/sign-in button
    const loginButton = page
      .locator(
        'button:has-text("Login"), button:has-text("Sign In"), a:has-text("Login"), a:has-text("Sign In"), button:has-text("Get Started")'
      )
      .first();
    if ((await loginButton.count()) > 0) {
      console.log('Found login button, clicking...');
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

  const hasEmailInput = (await emailInput.count()) > 0;
  const hasPasswordInput = (await passwordInput.count()) > 0;

  console.log('Email input found:', hasEmailInput);
  console.log('Password input found:', hasPasswordInput);

  if (hasEmailInput && hasPasswordInput) {
    console.log('Found login form, attempting to authenticate...');

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
      console.log('Found submit button, attempting login...');
      await submitButton.click();

      // Wait for navigation or success indicator
      try {
        await page.waitForURL(
          (url) => !url.pathname.includes('login') && !url.pathname.includes('auth'),
          { timeout: 10000 }
        );
        console.log('Successfully navigated after login');
      } catch {
        console.log('URL did not change, looking for dashboard elements...');
        try {
          await page.waitForSelector(
            '[data-testid="dashboard"], .dashboard, #dashboard, main, .app-container',
            { timeout: 5000 }
          );
          console.log('Found dashboard elements, assuming login successful');
        } catch {
          console.log('No dashboard elements found, login may have failed');
        }
      }
    }
  } else {
    console.log(
      'No login form found, app might not require authentication or is already authenticated'
    );
  }

  // Save the storage state (authenticated or not)
  await page.context().storageState({ path: authFile });
  console.log('Storage state saved to:', authFile);

  // Verify we can access the main app
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Take a screenshot for debugging
  await page.screenshot({ path: 'e2e/auth-setup-result.png', fullPage: true });
  console.log('Auth setup complete, screenshot saved');
});
