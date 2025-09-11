import { test, expect } from '../fixtures/mock-api.fixture';
import { BrandOnboardingPage } from '../pages/BrandOnboardingPage';

test.describe('Brand Onboarding', () => {
  let onboardingPage: BrandOnboardingPage;

  test.beforeEach(async ({ mockAPI }) => {
    onboardingPage = new BrandOnboardingPage(mockAPI);
    await onboardingPage.goto();
  });

  test('should complete full brand onboarding flow', async () => {
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
});
