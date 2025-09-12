import { BusinessInfo } from '../context/BrandContext';
import { brandV2Api, BrandKnowledge } from '../api/brandV2Api';
import convertToChipsArray from '../../../helpers/convertToChips';

interface ScrapeBrandWebsiteOptions {
  maxPages?: number;
  onProgress?: (step: string, progress?: number) => void;
  token: string;
}

const mapKnowledgeToBusinessInfo = (knowledge: BrandKnowledge, existingInfo: BusinessInfo): Partial<BusinessInfo> => {
  // Map personality traits to persona and toneAndVoice
  const personalityChips = convertToChipsArray(knowledge.personalityTraits?.slice(0, 3) || []);
  
  // Extract tone attributes as chips
  const toneChips = convertToChipsArray(
    Object.entries(knowledge.toneAttributes || {})
      .map(([key, value]) => `${key}: ${value}`)
      .slice(0, 3)
  );

  return {
    // Brand information
    mission: knowledge.brandDescription || existingInfo.mission,
    vision: knowledge.valueProposition || existingInfo.vision,
    target_audience: knowledge.targetAudience || existingInfo.target_audience,
    
    // Personality and tone
    persona: personalityChips,
    toneAndVoice: toneChips,
    values: personalityChips, // Use personality traits as values for now
    
    // Visual and product information
    brandColors: knowledge.colorPalette?.slice(0, 3) || [],
    products: knowledge.products?.map(p => p.name || JSON.stringify(p)) || [],
    
    // Mark as fetched and saved
    isFetched: true,
    isSaved: false, // Will be saved after user reviews
  };
};

const scrapeBrandWebsite = async (
  businessInfo: BusinessInfo,
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>,
  options: ScrapeBrandWebsiteOptions
) => {
  const { maxPages = 50, onProgress, token } = options;
  
  if (!businessInfo.name || !businessInfo.website) {
    throw new Error('Brand name and website are required');
  }

  try {
    // Use the complete brand onboarding workflow
    const { brand, knowledge } = await brandV2Api.completeBrandOnboarding(
      businessInfo.name,
      businessInfo.website,
      token,
      maxPages,
      onProgress
    );

    // Update business info with the extracted knowledge and brand ID
    const mappedData = mapKnowledgeToBusinessInfo(knowledge, businessInfo);
    
    setBusinessInfo((prevState) => ({
      ...prevState,
      ...mappedData,
      id: brand.id, // Store the brand ID for future operations
    }));

    return { brand, knowledge };
  } catch (error) {
    // Re-throw with more context
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to scrape brand website: ${errorMessage}`);
  }
};

export default scrapeBrandWebsite;
