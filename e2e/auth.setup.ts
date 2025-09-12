import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Set longer timeout for setup
  setup.setTimeout(90000); // 90 seconds
  console.log('🔐 SIMPLIFIED authentication setup for debugging...');

  // Mock Firebase Auth with detailed logging
  await page.route('https://identitytoolkit.googleapis.com/**', async (route) => {
    const url = route.request().url();
    const postData = route.request().postData();
    console.log('🔥 Firebase Auth intercepted:', url);
    console.log('🔥 Request data:', postData);

    if (url.includes('signInWithPassword')) {
      console.log('🔥 Responding to signInWithPassword with success');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          kind: 'identitytoolkit#VerifyPasswordResponse',
          localId: 'mock-user-id-123',
          email: 'test@example.com',
          displayName: 'Test User',
          idToken: 'mock-firebase-id-token-' + Date.now(),
          refreshToken: 'mock-refresh-token',
          expiresIn: '3600',
          emailVerified: true,
        }),
      });
    } else if (url.includes('accounts:lookup')) {
      console.log('🔥 Responding to accounts:lookup with user data');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          kind: 'identitytoolkit#GetAccountInfoResponse',
          users: [{
            localId: 'mock-user-id-123',
            email: 'test@example.com',
            displayName: 'Test User',
            emailVerified: true,
            providerUserInfo: [{
              providerId: 'password',
              email: 'test@example.com',
            }],
          }],
        }),
      });
    } else {
      console.log('🔥 Other Firebase request, returning empty success');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    }
  });

  // Mock backend API calls
  await page.route('**/api/v1/user**', async (route) => {
    const url = route.request().url();
    const headers = route.request().headers();
    console.log('🌐 Backend API intercepted:', url);
    console.log('🌐 Authorization header:', headers.authorization);
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        uid: 'mock-user-id-123',
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        hasBrand: true,
        plan: 'FREE',
        is_admin: false,
        token: 'mock-jwt-token-' + Date.now(),
      }),
    });
  });

  // Go to login page
  console.log('🚀 Navigating to /login...');
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  console.log('📍 On page:', page.url());

  // Save initial screenshot
  await page.screenshot({ path: path.join(__dirname, 'auth-01-login-page.png'), fullPage: true });

  // Wait for and fill form
  console.log('⏳ Waiting for email input...');
  await page.waitForSelector('input#email, input[type="email"]', { timeout: 15000 });

  console.log('📝 Filling form...');
  await page.fill('input#email, input[type="email"]', 'test@example.com');
  await page.fill('input#password, input[type="password"]', 'testpassword123');

  await page.screenshot({ path: path.join(__dirname, 'auth-02-form-filled.png'), fullPage: true });

  console.log('🚀 Submitting form...');
  await page.click('button[type="submit"]');

  // Wait and see what happens
  console.log('⏳ Waiting 5 seconds to see response...');
  await page.waitForTimeout(5000);

  console.log('📍 URL after submit:', page.url());
  await page.screenshot({ path: path.join(__dirname, 'auth-03-after-submit.png'), fullPage: true });

  // Create minimal auth file regardless of success
  console.log('💾 Creating auth file...');
  const fs = await import('fs');
  const authData = {
    cookies: [
      {
        name: 'token',
        value: 'mock-jwt-token',
        domain: 'localhost',
        path: '/',
        expires: Date.now() + 86400000,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ],
    origins: [
      {
        origin: 'http://localhost:3000',
        localStorage: [
          {
            name: 'profile',
            value: JSON.stringify({
              id: 'user-123',
              email: 'test@example.com',
              name: 'Test User',
              role: 'USER',
              hasBrand: true,
              token: 'mock-jwt-token',
            }),
          },
        ],
      },
    ],
  };

  // Ensure directory exists
  const fs2 = await import('fs');
  const path2 = await import('path');
  const dir = path2.dirname(authFile);
  fs2.mkdirSync(dir, { recursive: true });

  // Save storage state including IndexedDB (crucial for Firebase)
  await page.context().storageState({ path: authFile, indexedDB: true });
  console.log('✅ Auth file created with IndexedDB at:', authFile);
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

  // Mock additional dashboard API endpoints
  await page.route('**/api/v1/brands**', async (route: any) => {
    console.log('🏢 Brand API intercepted:', route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'brand-123',
          name: 'Test Brand',
          description: 'Test brand for E2E testing',
          user_id: 'mock-user-id-123',
        },
      ]),
    });
  });

  await page.route('**/api/v1/campaigns**', async (route: any) => {
    console.log('📋 Campaign API intercepted:', route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'campaign-123',
          name: 'Test Campaign',
          status: 'active',
          brand_id: 'brand-123',
        },
      ]),
    });
  });

  await page.route('**/api/v1/posts**', async (route: any) => {
    console.log('📝 Posts API intercepted:', route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
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
