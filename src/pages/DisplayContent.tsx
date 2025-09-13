import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/components/layout/Sidebar';
import { useLocation } from 'react-router-dom';
import { getServiceURL } from "../shared/utils/getServiceURL";

const DisplayContent = () => {
  const campaign = useLocation().search;
  const campaign_id = campaign.split('=', 2)[1]; // Access campaignId

  const endpointUrl = getServiceURL('data');

  const getUpscaledUrls = async () => {
    const response = await fetch(
      `${endpointUrl}/api/v1/data/get/filtered?query_kind=generated_content&query_order=campaign_id&query_limit=1&filter_prop=campaign_id&filter_value=${campaign_id}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get data');
    }

    const data = await response.json();
    // Add null safety checks for nested properties
    const upscaledUrls = data?.results?.[0]?.final_result?.response?.data?.upscaled_urls || [];
    return upscaledUrls;
  };

  const [upscaledUrls, setUpscaledUrls] = useState([]); // State to store URLs

  useEffect(() => {
    // Fetch URLs when the component mounts
    getUpscaledUrls().then((urls) => setUpscaledUrls(urls));
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="flex bg-gradient-to-br from-[#8E87D566] to-[#FFB5E6]">
      <Sidebar />
      <div className="flex flex-col mx-auto w-full mt-28 flex-grow">
        {/* ... your existing header and button ... */}

        {/* Display upscaled images */}
        <div className="flex flex-wrap justify-center">
          {Array.isArray(upscaledUrls) && upscaledUrls.length > 0 ? (
            upscaledUrls.map((url, index) => (
              <img key={index} src={url} alt={`Upscaled Image ${index + 1}`} className="m-4" /> // Adjust styling as needed
            ))
          ) : (
            <p className="text-gray-500">No images available</p>
          )}
        </div>

        {/* ... your existing paragraph ... */}
      </div>
    </div>
  );
};

export default DisplayContent;
