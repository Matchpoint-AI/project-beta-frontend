import { test, expect } from '@playwright/test';

test.describe('Debug Login Process', () => {
  test('debug actual login flow step by step', async ({ page }) => {
    console.log('🔍 Starting login debug...');

    // Step 1: Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('📍 Initial URL:', page.url());
    console.log('📄 Initial page title:', await page.title());

    // Take screenshot of initial state
    await page.screenshot({ path: 'e2e/debug-01-initial.png', fullPage: true });

    // Step 2: Check what's actually on the page
    const bodyText = await page.locator('body').textContent();
    console.log('📝 Page contains text:', bodyText?.substring(0, 200) + '...');

    // Step 3: Look for login elements
    const emailInput = page.locator('input#email, input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input#password, input[type="password"], input[name="password"]');
    const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]');

    console.log('🔍 Email input count:', await emailInput.count());
    console.log('🔍 Password input count:', await passwordInput.count());
    console.log('🔍 Login button count:', await loginButton.count());

    // Step 4: If not on login page, try to navigate there
    if (page.url().includes('/login') === false) {
      console.log('🚀 Not on login page, trying to navigate to /login');
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      console.log('📍 After /login navigation:', page.url());
      await page.screenshot({ path: 'e2e/debug-02-login-page.png', fullPage: true });
    }

    // Step 5: Wait for login form
    console.log('⏳ Waiting for login form elements...');
    try {
      await page.waitForSelector('input[type="email"], input#email', { timeout: 10000 });
      console.log('✅ Email input found');
    } catch (error) {
      console.error('❌ Email input not found:', error);
      
      // Debug what's actually on the page
      const allInputs = await page.locator('input').all();
      console.log('🔍 Found inputs:', allInputs.length);
      for (const input of allInputs) {
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const placeholder = await input.getAttribute('placeholder');
        console.log(`   - Input: type="${type}" name="${name}" id="${id}" placeholder="${placeholder}"`);
      }
      
      const allButtons = await page.locator('button').all();
      console.log('🔍 Found buttons:', allButtons.length);
      for (const button of allButtons) {
        const text = await button.textContent();
        const type = await button.getAttribute('type');
        console.log(`   - Button: text="${text}" type="${type}"`);
      }
      
      throw error;
    }

    // Step 6: Fill in the form
    console.log('📝 Filling login form...');
    await page.fill('input[type="email"], input#email', 'test@example.com');
    await page.fill('input[type="password"], input#password', 'testpassword123');

    console.log('✅ Form filled successfully');
    await page.screenshot({ path: 'e2e/debug-03-form-filled.png', fullPage: true });

    // Step 7: Submit the form
    console.log('🚀 Submitting form...');
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');

    // Step 8: Wait and see what happens
    console.log('⏳ Waiting for response...');
    await page.waitForTimeout(3000); // Wait 3 seconds to see what happens
    
    console.log('📍 URL after submit:', page.url());
    console.log('📄 Title after submit:', await page.title());
    
    await page.screenshot({ path: 'e2e/debug-04-after-submit.png', fullPage: true });

    // Step 9: Check for error messages
    const errorElements = await page.locator('[role="alert"], .error, .error-message, .alert-error').all();
    if (errorElements.length > 0) {
      console.log('❌ Found error elements:', errorElements.length);
      for (const error of errorElements) {
        const errorText = await error.textContent();
        console.log(`   - Error: "${errorText}"`);
      }
    } else {
      console.log('✅ No error elements found');
    }

    // Step 10: Check if we're still on login page
    if (page.url().includes('/login')) {
      console.log('⚠️  Still on login page after submit');
      const pageContent = await page.locator('body').textContent();
      console.log('📝 Page content after submit:', pageContent?.substring(0, 300) + '...');
    } else {
      console.log('✅ Successfully navigated away from login page');
    }

    console.log('🔍 Login debug complete');
  });
});