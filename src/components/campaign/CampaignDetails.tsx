import React, { useContext, useEffect, useState } from "react";
import { CampaignContext } from "../../context/CampaignContext";
import { getServiceURL } from "../../helpers/getServiceURL";
import { useAuth } from "../../features/auth/context/AuthContext";
import { CircularProgress } from "@mui/material";
import CampaignDetailsBlock from "./CampaignDetailsBlock";

type CampaignSpecsCopy = {
   key_features: string;
   audience: string;
   purpose: string;
};

export default function CampaignDetails() {
   const [specs, setSpecs] = useState<CampaignSpecsCopy | null>(null);
   const { campaignInfo } = useContext(CampaignContext);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
   const { profile } = useAuth();

   useEffect(() => {
      const prompt = `
Generate a JSON response based on the provided information to describe the key features, target audience, and purpose of a product campaign. The JSON should follow this format:

{
    "key_features": "A concise description of the product’s benefits, based on the product_features array.",
    "audience": "A description of the target audience, including age range, gender, interests, and relevant emotional goals, based on provided audience details.",
    "purpose": "A description explaining the goal of the campaign, mentioning the purpose and its focus."
}

Here’s the information to use for generating this response:

{
    "purpose": ${campaignInfo.purpose},
    "purposeAbout": ${campaignInfo.purposeAbout},
    "name": ${campaignInfo.name},
    "product_features": ${campaignInfo.product_features},
    "product": ${campaignInfo.product},
    "audienceAgeRange": ${campaignInfo.audienceAgeRange},
    "audienceInterests": ${campaignInfo.audienceInterests},
    "audienceGender": ${campaignInfo.audienceGender},
    "audienceRace": ${campaignInfo.audienceRace},
}

Use the information above to generate an accurate JSON response that includes concise descriptions for each property.
`;
      const endpointUrl = `${getServiceURL("llm")}/api/v1/llm/openai`;
      fetch(endpointUrl, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: profile?.token || "",
         },
         body: JSON.stringify({
            prompt,
            json_mode: true,
         }),
      })
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            setSpecs(JSON.parse(data.response.choices[0].message.content));
         })
         .catch(() => {
            setError(true);
         })
         .finally(() => setLoading(false));
   }, []);

   return (
      <>
         {error && (
            <div className="p-5 mb-[14px] bg-[#fff5f5] border border-[#F05252] rounded-md">
               <p className="text-[#F05252] font-medium">
                  Error loading campaign details
               </p>
            </div>
         )}
         {loading && (
            <div className="p-5 mb-[14px] flex items-center justify-center flex-col gap-1">
               <CircularProgress
                  sx={{ color: "#42389D" }}
                  size={25}
                  thickness={5}
               />
               <p className="text-[13px] capitalize text-[#6B7280]">
                  loading campaign details
               </p>
            </div>
         )}
         {specs && (
            <>
               {specs.key_features && (
                  <CampaignDetailsBlock
                     title="Key Competitive Features:"
                     text={specs.key_features}
                     review={campaignInfo.campaign_brief}
                  />
               )}
               {specs.audience && (
                  <CampaignDetailsBlock
                     title="Target Audience & Interest:"
                     text={specs.audience}
                     review={campaignInfo.campaign_brief}
                  />
               )}
               {specs.purpose && (
                  <CampaignDetailsBlock
                     title="Purpose:"
                     text={specs.purpose}
                     review={campaignInfo.campaign_brief}
                  />
               )}
            </>
         )}
      </>
   );
}
