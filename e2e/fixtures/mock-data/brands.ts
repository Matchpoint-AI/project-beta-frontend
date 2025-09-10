export const mockBrands = {
  newBrand: {
    id: null,
    name: '',
    industry: '',
    targetAudience: '',
  },

  onboardingBrand: {
    id: 'brand-onboarding-123',
    name: 'Acme Corp',
    industry: 'Technology',
    targetAudience: 'Developers',
    onboardingStep: 2,
    onboardingComplete: false,
    brandColors: ['#007bff', '#6c757d'],
    brandVoice: {
      tone: 'Professional',
      attributes: ['Innovative', 'Reliable'],
    },
  },

  completeBrand: {
    id: 'brand-complete-456',
    name: 'TechStart Inc',
    industry: 'SaaS',
    targetAudience: 'Small Businesses',
    onboardingComplete: true,
    brandVoice: {
      tone: 'Professional yet friendly',
      values: ['Innovation', 'Reliability', 'Customer Success'],
      attributes: ['Modern', 'Approachable', 'Expert'],
    },
    brandColors: ['#0066cc', '#00aa44', '#ffcc00'],
    competitors: [
      { name: 'CompetitorA', website: 'https://competitora.com' },
      { name: 'CompetitorB', website: 'https://competitorb.com' },
    ],
  },
};
