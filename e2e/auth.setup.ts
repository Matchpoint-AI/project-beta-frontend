import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  console.log('🔐 Starting authentication setup with mocked APIs...');

  // Mock Firebase Auth and API endpoints
  await setupMocks(page);

  // Navigate to login page
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  console.log('📍 Current URL:', page.url());

  // Wait for login form to be available
  await page.waitForSelector('input#email', { timeout: 10000 });

  // Use test credentials that match our mocked responses
  const email = 'test@example.com';
  const password = 'testpassword123';

  console.log('📧 Using mocked credentials:', email);

  // Fill in login form
  await page.fill('input#email', email);
  await page.fill('input#password', password);

  // Check remember me for longer sessions
  const rememberMe = await page.locator('input#terms');
  if (await rememberMe.isVisible()) {
    await rememberMe.check();
  }

  console.log('📝 Form filled, attempting mocked login...');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation after successful login
  try {
    // Wait for redirect away from login page
    await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 15000 });

    console.log('✅ Login successful! Current URL:', page.url());
  } catch (error) {
    console.log('⚠️  Login may have failed, checking for errors...');

    // Take a screenshot for debugging
    await page.screenshot({
      path: path.join(__dirname, 'auth-failed.png'),
      fullPage: true,
    });

    // Check for error messages
    const errorMessage = await page.locator('[role="alert"], .error-toast, .error').textContent();
    if (errorMessage) {
      console.error('❌ Login error:', errorMessage);
    }

    console.log('Current URL after attempted login:', page.url());
  }

  // Save the authentication state (with mocked user data)
  await page.context().storageState({ path: authFile });
  console.log('💾 Authentication state saved to:', authFile);

  // Take a screenshot for debugging
  await page.screenshot({
    path: path.join(__dirname, 'auth-result.png'),
    fullPage: true,
  });
  console.log('📸 Screenshot saved for debugging');
});

async function setupMocks(page: any) {
  // Mock Firebase Auth API calls
  await page.route('https://identitytoolkit.googleapis.com/**', async (route: any) => {
    const url = route.request().url();
    console.log('🔥 Intercepting Firebase Auth:', url);

    if (url.includes('signInWithPassword')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          kind: 'identitytoolkit#VerifyPasswordResponse',
          localId: 'mock-user-id-123',
          email: 'test@example.com',
          displayName: 'Test User',
          idToken: 'mock-firebase-id-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: '3600',
          emailVerified: true,
        }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    }
  });

  // Mock backend API calls
  await page.route('**/api/v1/user**', async (route: any) => {
    const url = route.request().url();
    console.log('🌐 Intercepting API call:', url);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        hasBrand: true, // Set to true for dashboard access, false for onboarding
        plan: 'FREE',
        is_admin: false,
        token: 'mock-jwt-token',
      }),
    });
  });

  // Mock other API endpoints as needed
  await page.route('**/api/**', async (route: any) => {
    const url = route.request().url();
    const method = route.request().method();
    console.log('🔧 Intercepting API:', method, url);

    // Default successful response
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });
}
