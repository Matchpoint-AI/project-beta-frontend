import { BusinessInfo } from '../context/BrandContext';
declare const scrapeBrandWebsite: (
  businessInfo: BusinessInfo,
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>
) => Promise<void>;
export default scrapeBrandWebsite;
