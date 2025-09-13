
// /api/v1/fetchContent
export const fetchWebsiteData = async (
  url: string,
  setProgressDescription: (description: string) => void
) => {
  const llm_url = import.meta.env.VITE_LLM_URL || 'https://localhost:7652';
  const response = await fetch(`${llm_url}/api/v1/llm/fetch-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();
  setProgressDescription('Extracting Physical Locations...');
  //    https://llm-dev-247jfvwvka-uc.a.run.app
  const get_locations = await fetch(`${llm_url}/api/v1/llm/physical-locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `
                    Please extract the physical locations from the provided HTML content. Return your findings in a JSON output following this structure:
                    {
                        "Physical_locations": [
                            "Location 1",
                            "Location 2",
                            ...
                        ]
                    }
                        Only return the JSON and nothing else. If no locations are found, return:
                    {
                        "Physical_locations": []
                    }
                `,
      htmlcontent: data,
    }),
  });

  const extract_location = await get_locations.json();

  const locations = extractPhysicalLocations(extract_location);

  return { data, locations };
};

function extractPhysicalLocations(jsonArray: string[]): string[] {
  // Initialize an empty array to hold all locations
  let combinedLocations: string[] = [];

  // Loop through each JSON string in the array
  for (const jsonString of jsonArray) {
    // Parse the JSON string into an object
    const data = JSON.parse(jsonString);

    // Extract the Physical_locations array
    const locations = data.Physical_locations || [];

    // Combine the locations into the result array
    combinedLocations = combinedLocations.concat(locations);
  }

  return combinedLocations;
}
