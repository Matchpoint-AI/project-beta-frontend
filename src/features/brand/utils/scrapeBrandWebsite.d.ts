import { BusinessInfo } from '../context/BrandContext';
import { BrandKnowledge } from '../api/brandV2Api';
interface ScrapeBrandWebsiteOptions {
    maxPages?: number;
    onProgress?: (step: string, progress?: number) => void;
    token: string;
}
declare const scrapeBrandWebsite: (businessInfo: BusinessInfo, setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>, options: ScrapeBrandWebsiteOptions) => Promise<{
    brand: import("../api/brandV2Api").BrandResponse;
    knowledge: BrandKnowledge;
}>;
export default scrapeBrandWebsite;
