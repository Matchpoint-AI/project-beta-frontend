import { createContext } from 'react';
export var BrandContext = createContext({
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
  setBusinessInfo: function () {},
});
//# sourceMappingURL=BrandContext.js.map
