import { createContext } from 'react';

export type Selectable = { selected: boolean; [key: string]: unknown };

export interface BusinessInfo {
  id?: string;
  name: string;
  website: string;
  campaigns?: {
    campaign_id: string;
    status: string;
    campaign_data: {
      campaign_variables: {
        durationNum: number;
        start_date: string;
      };
    };
  }[];
  product_features: string[];
  product_description: string;
  product_link: string;
  start_date: string;
  durationNum: number;
  industry?: string;
  vertical?: string;
  mission?: string;
  values?: Selectable[];
  persona?: Selectable[];
  toneAndVoice?: Selectable[];
  locations_fetched?: boolean;
  physical_locations?: string[];
  summary?: string;
  style?: string;
  services?: string[];
  target_consumer?: string;
  products?: string[];
  target_audience?: string;
  vision?: string;
  brandLogo?: string | File;
  logo?: string;
  brandColors?: string[];
  checkZip?: boolean;
  isSaved?: boolean;
  isFetched?: boolean;
  key_features?: string[];
}

interface BrandContextType {
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
}

export const BrandContext = createContext<BrandContextType>({
  businessInfo: {
    name: '',
    website: '',
    campaigns: [],
    product_features: [],
    product_description: '',
    product_link: '',
    start_date: '',
    durationNum: 0,
    summary: '',
    brandLogo: '',
    logo: '',
    brandColors: [],
  },
  setBusinessInfo: () => {},
});
