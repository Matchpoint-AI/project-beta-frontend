import { describe, it, expect, vi } from 'vitest';
import scrapeBrandWebsite from './scrapeBrandWebsite';

// Mock getServiceURL to avoid actual network calls
vi.mock('./getServiceURL', () => ({
  getServiceURL: () => 'http://mock-llm',
}));

// Mock convertToChipsArray to return the input array
vi.mock('./convertToChips', () => ({
  default: (arr: any[]) => arr,
}));

global.fetch = vi.fn();

describe('scrapeBrandWebsite', () => {
  const baseBusinessInfo = { website: 'https://example.com' } as any;
  const setBusinessInfo = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set brandColors to [] if colors is undefined', async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ 
        Brand_mission: 'm', 
        Brand_vision: 'v',
        Brand_values: ['v1'],
        Brand_tone_and_voice: ['t1'],
        Brand_persona: ['p1'],
        Brand_style: 's',
        Brand_products: 'p',
        Industry: 'i',
        Industry_Vertical: 'iv',
        Suggested_locations_for_photography: 'l',
        themes: 'th',
        scenes: 'sc',
        negative_prompts: 'np',
        colors: undefined 
      }),
      ok: true,
    });
    await scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo);
    
    // Check that setBusinessInfo was called with a function
    expect(setBusinessInfo).toHaveBeenCalledWith(expect.any(Function));
    
    // Call the function with a mock previous state to see what it returns
    const updateFunction = setBusinessInfo.mock.calls[0][0];
    const result = updateFunction(baseBusinessInfo);
    
    expect(result.brandColors).toEqual([]);
  });

  it('should set brandColors to [] if colors is null', async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ 
        Brand_mission: 'm',
        Brand_vision: 'v',
        Brand_values: ['v1'],
        Brand_tone_and_voice: ['t1'],
        Brand_persona: ['p1'],
        Brand_style: 's',
        Brand_products: 'p',
        Industry: 'i',
        Industry_Vertical: 'iv',
        Suggested_locations_for_photography: 'l',
        themes: 'th',
        scenes: 'sc',
        negative_prompts: 'np',
        colors: null 
      }),
      ok: true,
    });
    await scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo);
    
    const updateFunction = setBusinessInfo.mock.calls[0][0];
    const result = updateFunction(baseBusinessInfo);
    
    expect(result.brandColors).toEqual([]);
  });

  it('should set brandColors to [] if colors is missing', async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ 
        Brand_mission: 'm',
        Brand_vision: 'v',
        Brand_values: ['v1'],
        Brand_tone_and_voice: ['t1'],
        Brand_persona: ['p1'],
        Brand_style: 's',
        Brand_products: 'p',
        Industry: 'i',
        Industry_Vertical: 'iv',
        Suggested_locations_for_photography: 'l',
        themes: 'th',
        scenes: 'sc',
        negative_prompts: 'np'
        // colors property is missing entirely
      }),
      ok: true,
    });
    await scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo);
    
    const updateFunction = setBusinessInfo.mock.calls[0][0];
    const result = updateFunction(baseBusinessInfo);
    
    expect(result.brandColors).toEqual([]);
  });

  it('should set brandColors to first three colors if present', async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ 
        Brand_mission: 'm',
        Brand_vision: 'v',
        Brand_values: ['v1'],
        Brand_tone_and_voice: ['t1'],
        Brand_persona: ['p1'],
        Brand_style: 's',
        Brand_products: 'p',
        Industry: 'i',
        Industry_Vertical: 'iv',
        Suggested_locations_for_photography: 'l',
        themes: 'th',
        scenes: 'sc',
        negative_prompts: 'np',
        colors: ['#fff', '#000', '#ccc', '#ddd'] 
      }),
      ok: true,
    });
    await scrapeBrandWebsite(baseBusinessInfo, setBusinessInfo);
    
    const updateFunction = setBusinessInfo.mock.calls[0][0];
    const result = updateFunction(baseBusinessInfo);
    
    expect(result.brandColors).toEqual(['#fff', '#000', '#ccc']);
  });
}); 