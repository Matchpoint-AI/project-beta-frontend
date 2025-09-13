import { getServiceURL } from '../../../shared/utils/getServiceURL';
import { BusinessInfo } from '../context/BrandContext';
import convertToChipsArray from '../../../shared/utils/convertToChips';

const scrapeBrandWebsite = async (
  businessInfo: BusinessInfo,
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>
) => {
  const url = `${getServiceURL('llm')}/api/v1/llm/fetch-content`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: businessInfo.website,
      subject: 'website',
    }),
  });
  const parsedContent = await response.json();
  if (!parsedContent) throw new Error('no data found');
  setBusinessInfo((prevState) => ({
    ...prevState,
    mission: parsedContent['Brand_mission'],
    vision: parsedContent['Brand_vision'],
    values: convertToChipsArray(parsedContent['Brand_values']?.slice(0, 3) || []),
    toneAndVoice: convertToChipsArray(parsedContent['Brand_tone_and_voice']?.slice(0, 3) || []),
    persona: convertToChipsArray(parsedContent['Brand_persona']?.slice(0, 3) || []),
    style: parsedContent['Brand_style'],
    brandColors: parsedContent['colors']?.slice(0, 3) || [],
    products: parsedContent['Brand_products'],
    industry: parsedContent['Industry'],
    vertical: parsedContent['Industry_Vertical'],
    locations: parsedContent['Suggested_locations_for_photography'],
    themes: parsedContent['themes'],
    scenes: parsedContent['scenes'],
    negative_prompts: parsedContent['negative_prompts'],
  }));
};

export default scrapeBrandWebsite;
