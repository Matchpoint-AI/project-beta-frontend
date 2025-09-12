import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import scrapeBrandWebsite from './scrapeBrandWebsite';
import type { BusinessInfo } from '../context/BrandContext';

// Mock the new brandV2Api
vi.mock('../api/brandV2Api', () => ({
  brandV2Api: {
    completeBrandOnboarding: vi.fn(),
  },
}));

// Mock convertToChipsArray to return the input array as chips
vi.mock('../../../helpers/convertToChips', () => ({
  default: (arr: unknown[]) => arr?.map((item: any) => ({ selected: true, name: item })) || [],
}));

import { brandV2Api } from '../api/brandV2Api';

describe('scrapeBrandWebsite', () => {
  const baseBusinessInfo: BusinessInfo = {
    name: 'Test Company',
    website: 'https://example.com',
    product_features: [],
    product_description: 'Test product',
    product_link: 'https://example.com/product',
    start_date: '2024-01-01',
    durationNum: 30,
  };
  const setBusinessInfo = vi.fn();
  const mockToken = 'test-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully scrape and update business info with brand knowledge', async () => {
    const mockBrand = { id: 'brand-123', name: 'Test Company' };
    const mockKnowledge = {
      brandId: 'brand-123',
      personalityTraits: ['trait1', 'trait2'],
      toneAttributes: { tone1: 'value1' },
      colorPalette: ['#fff', '#000', '#ccc'],
      products: [{ name: 'Product 1' }],
      brandDescription: 'Test description',
      valueProposition: 'Test value prop',
      targetAudience: 'Test audience',
    };

    (brandV2Api.completeBrandOnboarding as any).mockResolvedValueOnce({
      brand: mockBrand,
      knowledge: mockKnowledge,
    });

    await scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo, { token: mockToken });

    // Verify API was called with correct parameters
    expect(brandV2Api.completeBrandOnboarding).toHaveBeenCalledWith(
      'Test Company',
      'https://example.com',
      mockToken,
      50,
      expect.any(Function)
    );

    // Check that setBusinessInfo was called
    expect(setBusinessInfo).toHaveBeenCalledWith(expect.any(Function));

    // Call the function to see what it returns
    const updateFunction = setBusinessInfo.mock.calls[0][0];
    const result = updateFunction(baseBusinessInfo);

    expect(result).toMatchObject({
      id: 'brand-123',
      mission: 'Test description',
      vision: 'Test value prop',
      target_audience: 'Test audience',
      brandColors: ['#fff', '#000', '#ccc'],
      isFetched: true,
      isSaved: false,
    });
  });

  it('should handle API errors gracefully', async () => {
    (brandV2Api.completeBrandOnboarding as any).mockRejectedValueOnce(new Error('API Error'));

    await expect(
      scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo, { token: mockToken })
    ).rejects.toThrow('Failed to scrape brand website: API Error');
  });

  it('should require name and website', async () => {
    const incompleteInfo = { ...baseBusinessInfo, name: '' };

    await expect(
      scrapeBrandWebsite(incompleteInfo, setBusinessInfo, { token: mockToken })
    ).rejects.toThrow('Brand name and website are required');
  });

  it('should handle empty color palette gracefully', async () => {
    const mockBrand = { id: 'brand-123', name: 'Test Company' };
    const mockKnowledge = {
      brandId: 'brand-123',
      personalityTraits: [],
      toneAttributes: {},
      colorPalette: [], // Empty color palette
      products: [],
      brandDescription: 'Test description',
    };

    (brandV2Api.completeBrandOnboarding as any).mockResolvedValueOnce({
      brand: mockBrand,
      knowledge: mockKnowledge,
    });

    await scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo, { token: mockToken });

    const updateFunction = setBusinessInfo.mock.calls[0][0];
    const result = updateFunction(baseBusinessInfo);

    expect(result.brandColors).toEqual([]);
  });
});
