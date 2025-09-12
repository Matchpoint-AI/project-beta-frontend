import { getServiceURL } from '../../../helpers/getServiceURL';

interface ScrapedProduct {
  name: string;
  description?: string;
  product_features: string[];
}

const scrapeProduct = async (
  url?: string,
  name?: string,
  description?: string
): Promise<ScrapedProduct> => {
  let endpointUrl = `${getServiceURL('llm')}/api/v1/llm/fetch-content`;
  let body: Record<string, unknown> = {};
  if (url) {
    body = { url, subject: 'product' };
  } else if (name || description) {
    endpointUrl = `${getServiceURL('llm')}/api/v1/llm/fetch-content`;
    body = { name, description, subject: 'product' };
  } else {
    throw new Error('No product URL or name/description provided');
  }

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const parsedContent = await response.json();

    if (!parsedContent) {
      throw new Error('No data found in response');
    }

    // Ensure consistent field naming
    const result: ScrapedProduct = {
      name: parsedContent.name || name || '',
      description: parsedContent.description || description || '',
      product_features: Array.isArray(parsedContent.product_features)
        ? parsedContent.product_features
        : Array.isArray(parsedContent.key_features)
          ? parsedContent.key_features
          : [],
    };

    // Validate that we have at least a name
    if (!result.name || result.name.trim() === '') {
      throw new Error('No product name found in response');
    }

    return result;
  } catch (_error) {
    throw _error;
  }
};

export default scrapeProduct;
