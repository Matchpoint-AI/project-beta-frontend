import { test as base, Page } from '@playwright/test';
import { apiResponses } from './mock-data/api-responses';

type MockAPIFixture = {
  mockAPI: Page;
};

export const test = base.extend<MockAPIFixture>({
  mockAPI: async ({ page }, use) => {
    // Mock all API endpoints
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      const method = route.request().method();
      const postData = route.request().postData();

      // Auth endpoints
      if (url.includes('/api/auth/login') && method === 'POST') {
        await route.fulfill(apiResponses.auth.login());
      }
      // Brand endpoints
      else if (url.includes('/api/brands') && method === 'GET') {
        const brandId = url.split('/').pop();
        if (brandId && brandId !== 'brands') {
          await route.fulfill(apiResponses.brands.get(brandId));
        } else {
          await route.fulfill(apiResponses.brands.list());
        }
      } else if (url.includes('/api/brands') && method === 'POST') {
        const data = postData ? JSON.parse(postData) : {};
        await route.fulfill(apiResponses.brands.create(data));
      } else if (url.includes('/api/brands') && method === 'PUT') {
        const brandId = url.split('/').pop();
        const data = postData ? JSON.parse(postData) : {};
        await route.fulfill(apiResponses.brands.update(brandId!, data));
      }
      // Campaign endpoints
      else if (url.includes('/api/campaigns') && method === 'GET') {
        await route.fulfill(apiResponses.campaigns.list());
      } else if (url.includes('/api/campaigns') && method === 'POST') {
        const data = postData ? JSON.parse(postData) : {};
        await route.fulfill(apiResponses.campaigns.create(data));
      }
      // Content generation endpoints
      else if (url.includes('/api/content/generate') && method === 'POST') {
        await route.fulfill(apiResponses.content.generate());
      }
      // Default: continue to actual backend
      else {
        await route.continue();
      }
    });

    // Use the page with mocked API
    await use(page);
  },
});

export { expect } from '@playwright/test';
