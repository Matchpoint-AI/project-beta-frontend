import { Page, Locator } from '@playwright/test';

export class BrandOnboardingPage {
  readonly page: Page;
  readonly brandNameInput: Locator;
  readonly industrySelect: Locator;
  readonly targetAudienceInput: Locator;
  readonly brandVoiceTextarea: Locator;
  readonly brandColorsInput: Locator;
  readonly competitorInput: Locator;
  readonly addCompetitorButton: Locator;
  readonly nextStepButton: Locator;
  readonly previousStepButton: Locator;
  readonly saveButton: Locator;
  readonly completeOnboardingButton: Locator;
  readonly progressIndicator: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form inputs
    this.brandNameInput = page.getByTestId('brand-name-input');
    this.industrySelect = page.getByTestId('industry-select');
    this.targetAudienceInput = page.getByTestId('target-audience-input');
    this.brandVoiceTextarea = page.getByTestId('brand-voice-textarea');
    this.brandColorsInput = page.getByTestId('brand-colors-input');
    this.competitorInput = page.getByTestId('competitor-input');

    // Buttons
    this.addCompetitorButton = page.getByTestId('add-competitor-button');
    this.nextStepButton = page.getByTestId('next-step-button');
    this.previousStepButton = page.getByTestId('previous-step-button');
    this.saveButton = page.getByTestId('save-button');
    this.completeOnboardingButton = page.getByTestId('complete-onboarding-button');

    // UI elements
    this.progressIndicator = page.getByTestId('onboarding-progress');
    this.errorMessage = page.locator('.error-message');
    this.successMessage = page.locator('.success-message');
  }

  async goto() {
    await this.page.goto('/brands/onboarding');
  }

  async fillBasicInfo(brandName: string, industry: string, targetAudience: string) {
    await this.brandNameInput.fill(brandName);
    await this.industrySelect.selectOption(industry);
    await this.targetAudienceInput.fill(targetAudience);
  }

  async fillBrandVoice(voiceDescription: string) {
    await this.brandVoiceTextarea.fill(voiceDescription);
  }

  async addBrandColors(colors: string[]) {
    for (const color of colors) {
      await this.brandColorsInput.fill(color);
      await this.page.keyboard.press('Enter');
    }
  }

  async addCompetitor(name: string, website?: string) {
    await this.competitorInput.fill(name);
    if (website) {
      await this.page.getByTestId('competitor-website-input').fill(website);
    }
    await this.addCompetitorButton.click();
  }

  async goToNextStep() {
    await this.nextStepButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPreviousStep() {
    await this.previousStepButton.click();
  }

  async saveProgress() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async completeOnboarding() {
    await this.completeOnboardingButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentStep(): Promise<number> {
    const progressText = await this.progressIndicator.textContent();
    const match = progressText?.match(/Step (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async waitForErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent()) || '';
  }

  async waitForSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible' });
    return (await this.successMessage.textContent()) || '';
  }

  async isOnboardingComplete(): Promise<boolean> {
    const completeIndicator = this.page.getByTestId('onboarding-complete');
    return await completeIndicator.isVisible();
  }

  async completeFullOnboarding(brandData: {
    name: string;
    industry: string;
    targetAudience: string;
    brandVoice: string;
    colors: string[];
    competitors: Array<{ name: string; website?: string }>;
  }) {
    // Step 1: Basic Information
    await this.fillBasicInfo(brandData.name, brandData.industry, brandData.targetAudience);
    await this.goToNextStep();

    // Step 2: Brand Voice
    await this.fillBrandVoice(brandData.brandVoice);
    await this.goToNextStep();

    // Step 3: Brand Colors
    await this.addBrandColors(brandData.colors);
    await this.goToNextStep();

    // Step 4: Competitors
    for (const competitor of brandData.competitors) {
      await this.addCompetitor(competitor.name, competitor.website);
    }
    await this.goToNextStep();

    // Step 5: Review and Complete
    await this.completeOnboarding();
  }
}
