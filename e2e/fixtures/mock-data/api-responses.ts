import { mockBrands } from './brands';

export const apiResponses = {
  brands: {
    list: () => ({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        brands: [mockBrands.completeBrand, mockBrands.onboardingBrand],
        total: 2,
      }),
    }),

    get: (brandId: string) => ({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        brandId === 'brand-onboarding-123' ? mockBrands.onboardingBrand : mockBrands.completeBrand
      ),
    }),

    create: (data: any) => ({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        ...mockBrands.onboardingBrand,
        ...data,
        id: `brand-${Date.now()}`,
        onboardingStep: 1,
        onboardingComplete: false,
      }),
    }),

    update: (brandId: string, data: any) => ({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...mockBrands.onboardingBrand,
        ...data,
        id: brandId,
      }),
    }),

    error: {
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Invalid brand data',
        details: ['Name is required', 'Industry must be selected'],
      }),
    },

    serverError: {
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Something went wrong on our end',
      }),
    },
  },

  auth: {
    login: () => ({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        },
        token: 'mock-jwt-token',
      }),
    }),

    unauthorized: {
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Unauthorized',
        message: 'Invalid credentials',
      }),
    },
  },

  campaigns: {
    list: () => ({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        campaigns: [
          {
            id: 'campaign-1',
            brandId: 'brand-complete-456',
            title: 'Summer Campaign 2025',
            status: 'active',
            createdAt: '2025-01-01T00:00:00Z',
          },
          {
            id: 'campaign-2',
            brandId: 'brand-complete-456',
            title: 'Product Launch',
            status: 'draft',
            createdAt: '2025-01-15T00:00:00Z',
          },
        ],
        total: 2,
      }),
    }),

    create: (data: any) => ({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: `campaign-${Date.now()}`,
        ...data,
        status: 'draft',
        createdAt: new Date().toISOString(),
      }),
    }),
  },

  content: {
    generate: () => ({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        content: {
          id: `content-${Date.now()}`,
          text: 'This is AI-generated content for your brand.',
          platform: 'instagram',
          type: 'post',
          hashtags: ['#Technology', '#Innovation', '#AI'],
          imagePrompt: 'Modern tech office with developers working',
        },
      }),
    }),

    generating: {
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'processing',
        message: 'Content is being generated...',
        estimatedTime: 30,
      }),
    },
  },
};
