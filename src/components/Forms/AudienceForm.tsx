/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEventHandler, useContext, useEffect, useState } from 'react';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { CampaignContext } from '../../features/campaign/context/CampaignContext';
import AgeDropdown from '../shared/AgeDropdown';
import Dropdown from '../../shared/components/ui/Dropdown';
// import CustomInput from "../shared/Inputs/CustomInput";
import FormsContainer from '../shared/FormsContainer';
import BackButton from '../../shared/components/buttons/BackButton';
import NextButton from '../../shared/components/buttons/NextButton';
import { getServiceURL } from '../../helpers/getServiceURL';
import AudienceDetails from '../AudienceDetails';
import posthog from '../../helpers/posthog';
import { useAuth } from '../../features/auth/context/AuthContext';

interface AudienceFormProps {
  handleNext?: any;
  handleBack?: any;
  review?: boolean;
}

const AudienceForm = ({ handleNext, handleBack, review = false }: AudienceFormProps) => {
  const { businessInfo }: any = useContext(BrandContext);
  const { campaignInfo, setCampaignInfo }: any = useContext(CampaignContext);
  const { profile } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audienceEmotion, setAudienceEmotion] = React.useState<string[]>(
    campaignInfo.audienceEmotion ?? []
  );
  const [audienceInterests, setAudienceInterests] = React.useState<string[]>(
    campaignInfo.audienceInterests ?? []
  );

  const options = ['All Ages', '18-24', '25-34', '35-44', '45-54', '55-64', '18+', '21+', '65+'];
  const [audienceAgeRange, setAudienceAgeRage] = useState<string[]>(
    campaignInfo.audienceAgeRange ?? []
  );
  const [audienceGender, setAudienceGender] = useState<string>(campaignInfo.audienceGender ?? '');
  const [audienceRace, setAudienceRace] = useState<string>(campaignInfo.audienceRace ?? '');
  // audienceRace
  const prompt = `For the brand ${
    businessInfo.name
  } and the data we collected from their URL in step 1: ${JSON.stringify({
    name: businessInfo.name,
    industry: businessInfo.industry,
  })}, please provide the audience emotion and interests to portray in an image that most closely aligns with ${
    campaignInfo.purpose
  } that will result in a best in class social campaign within the ${
    businessInfo.industry
  } industry and ${
    businessInfo.vertical
  } vertical. Provide the answer in the form of two arrays of strings where the first array represents audience emotions and the second array represents audience interests. Answer should be just the arrays and nothing else.`;

  useEffect(() => {
    if (campaignInfo.campaign_id !== undefined) return;
    if (audienceEmotion.length !== 0 && audienceInterests.length !== 0) return;
    const endpointUrl = `${getServiceURL('llm')}/api/v1/llm/openai`;
    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    })
      .then((response) => response.json())
      .then((_data) => {
        const { choices } = _data.response;
        const { content } = choices[0].message;
        const arrays = content.match(/\[.*?\]/g);
        if (arrays && arrays.length === 2) {
          const array1 = JSON.parse(arrays[0]);
          const array2 = JSON.parse(arrays[1]);

          setAudienceEmotion(array1.slice(0, 3));
          setAudienceInterests(array2.slice(0, 3));
          setCampaignInfo((prev: any) => ({
            ...prev,
            audienceEmotion: array1.slice(0, 3),
            audienceInterests: array2.slice(0, 3),
          }));
          // Assuming you have another state or function to handle the second array
        }
      })
      .catch((_error) => {});
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setCampaignInfo((prev: any) => ({
      ...prev,
      audienceEmotion: audienceEmotion,
      audienceInterests: audienceInterests,
    }));
    if (posthog.__loaded) {
      posthog.capture('Campaign Step Completed', {
        distinct_id: profile?.id,
        step: 3,
      });
    }
    handleNext();
  };

  const clickHandler = () => {
    if (campaignInfo.purposeAbout === 'Our business’s brand') handleBack(2);
    else handleBack();
  };

  useEffect(() => {
    setCampaignInfo((prev: any) => ({
      ...prev,
      audienceAgeRange: audienceAgeRange,
    }));
  }, [audienceAgeRange]);

  useEffect(() => {
    setCampaignInfo((prev: any) => ({
      ...prev,
      audienceGender: audienceGender,
    }));
  }, [audienceGender]);

  useEffect(() => {
    setCampaignInfo((prev: any) => ({
      ...prev,
      audienceRace: audienceRace,
    }));
  }, [audienceRace]);
  return (
    <>
      <FormsContainer>
        <form id="audience_form" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label title="email" className="block mb-2 text-xl font-medium text-gray-900">
              Audience Gender
            </label>
            <p className="my-2 text-sm text-[#111928]">Select 1</p>
            <Dropdown
              currentValue={audienceGender}
              options={[
                'Everyone',
                'Female',
                'Male',
                'Non-binary',
                'Genderqueer',
                'Genderfluid',
                'Agender',
                'Bigender',
                'Transgender Male',
                'Transgender Female',
              ]}
              onUpdateContext={(value: string) => {
                setAudienceGender(value);
                // setCampaignInfo({ ...campaignInfo, audienceGender: value });
              }}
              className="w-full"
            />
          </div>
          <div className="mb-5">
            <label title="email" className="block mb-2 text-xl font-medium text-gray-900">
              Audience Race/Ethnicity
            </label>
            <p className="my-2 text-sm text-[#111928]">Select 1</p>
            <Dropdown
              currentValue={audienceRace}
              options={[
                'Everyone',
                'American Indian or Alaska Native',
                'Asian or Asian American',
                'Black or African American',
                'Hispanic or Latino',
                'Indian',
                'Middle Eastern or North African',
                'Native Hawaiian or Pacific Islander',
                'White or European',
                'Other',
              ]}
              onUpdateContext={(value: string) => {
                setAudienceRace(value);
                // setCampaignInfo({ ...campaignInfo, audienceRace: value });
              }}
              className="w-full"
            />
          </div>
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <label title="email" className="block mb-2 text-xl font-medium text-gray-900">
                Audience Age Range
              </label>
            </div>
            <p className="text-[#111928] text-sm">Select up to 2</p>
            <div className="mt-2 space-x-0 space-y-2 p-0 rounded-md">
              <AgeDropdown
                currentValues={audienceAgeRange}
                options={options}
                onUpdateContext={(value: string[]) => {
                  setAudienceAgeRage(value);
                }}
              />
            </div>
          </div>
          <AudienceDetails
            title="Audience Interests"
            values={audienceInterests}
            setValues={setAudienceInterests}
            genre="interests"
          />
          <AudienceDetails
            title="Audience Emotion"
            values={audienceEmotion}
            setValues={setAudienceEmotion}
            genre="emotion"
          />
        </form>
      </FormsContainer>
      {!review && (
        <div className="flex justify-between mb-10 w-full">
          <BackButton onClick={clickHandler} />
          <NextButton text="Next" formId="audience_form" />
        </div>
      )}
    </>
  );
};

export default AudienceForm;
