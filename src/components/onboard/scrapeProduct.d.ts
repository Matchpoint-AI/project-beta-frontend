interface ScrapedProduct {
    name: string;
    description?: string;
    product_features: string[];
}
declare const scrapeProduct: (url?: string, name?: string, description?: string) => Promise<ScrapedProduct>;
export default scrapeProduct;
