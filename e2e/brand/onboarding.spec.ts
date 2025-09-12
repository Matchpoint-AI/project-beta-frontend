import { test, expect } from '../fixtures/mock-api.fixture';
import { BrandOnboardingPage } from '../pages/BrandOnboardingPage';
import path from 'path';

test.describe('Brand Onboarding', () => {
  test.describe.configure({ mode: 'parallel' });
  let onboardingPage: BrandOnboardingPage;

  test.beforeEach(async ({ mockAPI }) => {
    onboardingPage = new BrandOnboardingPage(mockAPI);
    await onboardingPage.goto();
  });

  test('should complete full brand onboarding flow', { tag: ['@smoke', '@critical'] }, async ({ page }, testInfo) => {
    // Attach test metadata for better artifact organization
    await testInfo.attach('test-metadata', {
      body: JSON.stringify({
        testName: 'Full Onboarding Flow',
        timestamp: new Date().toISOString(),
        browser: testInfo.project.name,
      }),
      contentType: 'application/json',
    });
    // Arrange
    const brandData = {
      name: 'Test Brand Co',
      industry: 'Technology',
      targetAudience: 'Small businesses and startups',
      brandVoice: 'Professional, innovative, and approachable',
      colors: ['#007bff', '#28a745', '#ffc107'],
      competitors: [
        { name: 'Competitor One', website: 'https://competitor1.com' },
        { name: 'Competitor Two', website: 'https://competitor2.com' },
      ],
    };

    // Act & Assert - Step 1: Basic Information
    await test.step('Fill basic brand information', async () => {
      await onboardingPage.fillBasicInfo(
        brandData.name,
        brandData.industry,
        brandData.targetAudience
      );
      await expect(onboardingPage.brandNameInput).toHaveValue(brandData.name);
      await expect(onboardingPage.industrySelect).toHaveValue(brandData.industry);
      await expect(onboardingPage.targetAudienceInput).toHaveValue(brandData.targetAudience);

      await onboardingPage.goToNextStep();
      expect(await onboardingPage.getCurrentStep()).toBe(2);
    });

    // Step 2: Brand Voice
    await test.step('Define brand voice', async () => {
      await onboardingPage.fillBrandVoice(brandData.brandVoice);
      await expect(onboardingPage.brandVoiceTextarea).toHaveValue(brandData.brandVoice);

      await onboardingPage.goToNextStep();
      expect(await onboardingPage.getCurrentStep()).toBe(3);
    });

    // Step 3: Brand Colors
    await test.step('Add brand colors', async () => {
      await onboardingPage.addBrandColors(brandData.colors);

      // Verify colors are added
      for (const color of brandData.colors) {
        const colorChip = onboardingPage.page.locator(`[data-color="${color}"]`);
        await expect(colorChip).toBeVisible();
      }

      await onboardingPage.goToNextStep();
      expect(await onboardingPage.getCurrentStep()).toBe(4);
    });

    // Step 4: Competitors
    await test.step('Add competitors', async () => {
      for (const competitor of brandData.competitors) {
        await onboardingPage.addCompetitor(competitor.name, competitor.website);

        // Verify competitor is added to the list
        const competitorItem = onboardingPage.page.locator(
          `[data-testid="competitor-${competitor.name}"]`
        );
        await expect(competitorItem).toBeVisible();
      }

      await onboardingPage.goToNextStep();
      expect(await onboardingPage.getCurrentStep()).toBe(5);
    });

    // Step 5: Complete Onboarding
    await test.step('Complete onboarding', async () => {
      await onboardingPage.completeOnboarding();

      // Verify success message
      const successMessage = await onboardingPage.waitForSuccessMessage();
      expect(successMessage).toContain('Brand onboarding complete');

      // Verify onboarding is marked as complete
      expect(await onboardingPage.isOnboardingComplete()).toBe(true);
    });
  });

  test('should allow navigating between steps', async () => {
    // Fill step 1
    await onboardingPage.fillBasicInfo('Test Brand', 'Technology', 'Developers');
    await onboardingPage.goToNextStep();
    expect(await onboardingPage.getCurrentStep()).toBe(2);

    // Go back to step 1
    await onboardingPage.goToPreviousStep();
    expect(await onboardingPage.getCurrentStep()).toBe(1);

    // Verify data is preserved
    await expect(onboardingPage.brandNameInput).toHaveValue('Test Brand');
  });

  test('should save progress and resume later', async () => {
    // Fill partial information
    await onboardingPage.fillBasicInfo('Draft Brand', 'SaaS', 'Enterprises');
    await onboardingPage.saveProgress();

    // Verify success message
    const successMessage = await onboardingPage.waitForSuccessMessage();
    expect(successMessage).toContain('Progress saved');

    // Reload the page
    await onboardingPage.page.reload();

    // Verify data is preserved
    await expect(onboardingPage.brandNameInput).toHaveValue('Draft Brand');
    await expect(onboardingPage.industrySelect).toHaveValue('SaaS');
  });

  test('should validate required fields', async () => {
    // Try to proceed without filling required fields
    await onboardingPage.goToNextStep();

    // Verify error message
    const errorMessage = await onboardingPage.waitForErrorMessage();
    expect(errorMessage).toContain('Please fill in all required fields');

    // Verify we're still on step 1
    expect(await onboardingPage.getCurrentStep()).toBe(1);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/brands', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Create new page instance with error-mocked API
    const errorPage = new BrandOnboardingPage(page);
    await errorPage.goto();

    // Try to save
    await errorPage.fillBasicInfo('Error Test', 'Technology', 'Users');
    await errorPage.saveProgress();

    // Verify error handling
    const errorMessage = await errorPage.waitForErrorMessage();
    expect(errorMessage).toContain('Something went wrong');
  });

  test('should handle quick onboarding with minimal data', async () => {
    // Use the helper method for full onboarding
    await onboardingPage.completeFullOnboarding({
      name: 'Quick Brand',
      industry: 'E-commerce',
      targetAudience: 'Online shoppers',
      brandVoice: 'Friendly and helpful',
      colors: ['#000000', '#ffffff'],
      competitors: [{ name: 'Amazon' }],
    });

    // Verify completion
    expect(await onboardingPage.isOnboardingComplete()).toBe(true);
  });

  test('should validate brand name uniqueness', async ({ page }) => {
    // Mock API to return duplicate error
    await page.route('**/api/brands/check-name', (route) => {
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Brand name already exists',
          suggestion: 'Test Brand Co 2',
        }),
      });
    });

    const duplicatePage = new BrandOnboardingPage(page);
    await duplicatePage.goto();

    // Enter duplicate brand name
    await duplicatePage.brandNameInput.fill('Existing Brand');
    await duplicatePage.brandNameInput.blur(); // Trigger validation

    // Verify error message
    const errorMessage = await duplicatePage.waitForErrorMessage();
    expect(errorMessage).toContain('Brand name already exists');

    // Verify suggestion is shown
    const suggestion = page.locator('[data-testid="name-suggestion"]');
    await expect(suggestion).toContainText('Test Brand Co 2');
  });

  test('should allow skipping optional steps', async () => {
    // Fill only required fields
    await onboardingPage.fillBasicInfo('Minimal Brand', 'Technology', 'Everyone');
    await onboardingPage.goToNextStep();

    // Skip brand voice (optional)
    await onboardingPage.goToNextStep();

    // Skip colors (optional)
    await onboardingPage.goToNextStep();

    // Skip competitors (optional)
    await onboardingPage.goToNextStep();

    // Complete onboarding
    await onboardingPage.completeOnboarding();

    // Verify completion with minimal data
    expect(await onboardingPage.isOnboardingComplete()).toBe(true);
  });

  test('should handle file upload for brand logo', async ({ page }) => {
    // Arrange
    const logoPath = path.join(__dirname, '../fixtures/test-assets/brand-logo.png');
    const onboardingPage = new BrandOnboardingPage(page);
    await onboardingPage.goto();

    // Act & Assert
    await test.step('Upload brand logo', async () => {
      // Create a test logo file if it doesn't exist
      const fileInput = page.locator('input[type="file"][data-testid="logo-upload"]');
      
      if (await fileInput.isVisible()) {
        // Create a dummy image file for testing
        await fileInput.setInputFiles({
          name: 'test-logo.png',
          mimeType: 'image/png',
          buffer: Buffer.from('fake-png-data'),
        });

        // Verify upload preview
        const preview = page.locator('[data-testid="logo-preview"]');
        await expect(preview).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    const onboardingPage = new BrandOnboardingPage(page);
    await onboardingPage.goto();

    // Test keyboard navigation
    await test.step('Navigate with keyboard', async () => {
      // Tab to first input
      await page.keyboard.press('Tab');
      await expect(onboardingPage.brandNameInput).toBeFocused();

      // Fill using keyboard
      await page.keyboard.type('Keyboard Test Brand');
      await expect(onboardingPage.brandNameInput).toHaveValue('Keyboard Test Brand');

      // Tab to next field
      await page.keyboard.press('Tab');
      // Industry select should be focused
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
      expect(focusedElement).toBe('industry-select');

      // Use arrow keys to select option
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      // Tab to continue
      await page.keyboard.press('Tab');
      await expect(onboardingPage.targetAudienceInput).toBeFocused();
    });
  });

  test('should handle concurrent form updates', async ({ page }) => {
    const onboardingPage = new BrandOnboardingPage(page);
    await onboardingPage.goto();

    // Simulate rapid concurrent updates
    await test.step('Rapid form updates', async () => {
      const updates = [
        onboardingPage.brandNameInput.fill('Update 1'),
        onboardingPage.targetAudienceInput.fill('Audience 1'),
        onboardingPage.brandNameInput.fill('Update 2'),
        onboardingPage.targetAudienceInput.fill('Audience 2'),
      ];

      await Promise.all(updates);

      // Verify final state
      await expect(onboardingPage.brandNameInput).toHaveValue('Update 2');
      await expect(onboardingPage.targetAudienceInput).toHaveValue('Audience 2');
    });
  });

  test('should measure performance metrics', async ({ page }, testInfo) => {
    const onboardingPage = new BrandOnboardingPage(page);
    
    // Start performance measurement
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = {
        startTime: Date.now(),
        interactions: [],
      };
    });

    await onboardingPage.goto();

    // Measure step transition times
    const metrics = [];
    
    await test.step('Measure step transitions', async () => {
      // Step 1
      const step1Start = Date.now();
      await onboardingPage.fillBasicInfo('Perf Test', 'Technology', 'Users');
      await onboardingPage.goToNextStep();
      const step1End = Date.now();
      metrics.push({ step: 1, duration: step1End - step1Start });

      // Step 2
      const step2Start = Date.now();
      await onboardingPage.fillBrandVoice('Fast and efficient');
      await onboardingPage.goToNextStep();
      const step2End = Date.now();
      metrics.push({ step: 2, duration: step2End - step2Start });
    });

    // Attach performance metrics
    await testInfo.attach('performance-metrics', {
      body: JSON.stringify(metrics),
      contentType: 'application/json',
    });

    // Assert reasonable performance
    metrics.forEach(metric => {
      expect(metric.duration).toBeLessThan(3000); // Each step should complete within 3 seconds
    });
  });

  test('should handle network interruptions gracefully', async ({ page, context }) => {
    const onboardingPage = new BrandOnboardingPage(page);
    await onboardingPage.goto();

    // Fill some data
    await onboardingPage.fillBasicInfo('Network Test', 'Technology', 'Everyone');

    // Simulate network interruption
    await test.step('Simulate offline mode', async () => {
      await context.setOffline(true);
      
      // Try to save - should handle gracefully
      await onboardingPage.saveProgress();
      
      // Should show offline indicator or error
      const errorVisible = await page.locator('[data-testid="offline-indicator"], .error-message').isVisible();
      expect(errorVisible).toBe(true);

      // Restore network
      await context.setOffline(false);
      
      // Retry save
      await onboardingPage.saveProgress();
      const successMessage = await onboardingPage.waitForSuccessMessage();
      expect(successMessage).toBeTruthy();
    });
  });

  test('should capture visual regression snapshots', async ({ page }, testInfo) => {
    const onboardingPage = new BrandOnboardingPage(page);
    await onboardingPage.goto();

    // Only run visual tests in Chromium for consistency
    if (testInfo.project.name === 'chromium') {
      await test.step('Capture step snapshots', async () => {
        // Step 1 snapshot
        await expect(page).toHaveScreenshot('onboarding-step-1.png', {
          fullPage: true,
          animations: 'disabled',
        });

        // Fill and move to step 2
        await onboardingPage.fillBasicInfo('Visual Test', 'Technology', 'Users');
        await onboardingPage.goToNextStep();

        // Step 2 snapshot
        await expect(page).toHaveScreenshot('onboarding-step-2.png', {
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Capture additional debug info on failure
    if (testInfo.status === 'failed') {
      // Capture console logs
      const consoleLogs = await page.evaluate(() => {
        return window.consoleLogs || [];
      });
      
      await testInfo.attach('console-logs', {
        body: JSON.stringify(consoleLogs),
        contentType: 'application/json',
      });

      // Capture network activity
      const requests = [];
      page.on('request', request => requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
      }));

      await testInfo.attach('network-requests', {
        body: JSON.stringify(requests),
        contentType: 'application/json',
      });

      // Capture DOM snapshot
      const html = await page.content();
      await testInfo.attach('dom-snapshot', {
        body: html,
        contentType: 'text/html',
      });
    }
  });
});
