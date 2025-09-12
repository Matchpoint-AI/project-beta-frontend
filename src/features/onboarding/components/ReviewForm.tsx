import React, { FormEventHandler, useContext, useEffect, useState } from 'react';
import { BrandContext } from '../../features/brand/context/BrandContext';
import BackButton from '../../shared/components/buttons/BackButton';
import { getServiceURL } from '../../helpers/getServiceURL';
import { CircularProgress } from '@mui/material';
import FormsContainer from '../shared/FormsContainer';
import BrandDetailsReview from '../../features/brand/components/BrandDetailsReview';
import type { Selectable } from '../../features/brand/context/BrandContext';

interface ReviewFormProps {
  setFormStep: (step: number) => void;
  handleSave: () => void;
  handleBack: () => void;
  saving: boolean;
}

const ReviewForm = ({ setFormStep, handleBack, handleSave, saving }: ReviewFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);
  const [logo, setLogo] = useState('');
  const [summary, setSummary] = useState('');
  const [, setRunValidation] = useState(0);

  const getSummary = async () => {
    const url = `${getServiceURL('llm')}/api/v1/llm/openai`;
    if (businessInfo?.summary !== undefined) {
      setSummary(businessInfo?.summary);
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Using the data for ${businessInfo.name}, please create a brand summary that:
               1. Highlights the brand's mission, vision, and values
               2. Describes the brand tone and voice
               3. Outlines the brand persona and style
               4. Summarizes the industry and vertical
               5. Is 60 words or less
               6. Summarizes the industry the business operates within and the goals of the business
               7. Summary of products or services the business provides
               8. Describes the general target consumer
               9. Describes general brand style and personality
               10. Does not include: Brand colors, List of services, Location of business

               Use this data:
               Brand Details: ${JSON.stringify({
                 ...businessInfo,
                 values: businessInfo.values
                   ?.filter((t: Selectable) => t?.selected)
                   .map((t: Selectable) => t.label),
                 persona: businessInfo.persona
                   ?.filter((t: Selectable) => t?.selected)
                   .map((t: Selectable) => t.label),
                 toneAndVoice: businessInfo.toneAndVoice
                   ?.filter((t: Selectable) => t?.selected)
                   .map((t: Selectable) => t.label),
               })}

               Format the response as a single cohesive summary paragraph following this example style:
               "${businessInfo.name} is committed to ${
                 businessInfo.mission
               }, envisioning a future where ${businessInfo.vision}. Operating in the ${
                 businessInfo.industry
               } industry, the brand emphasizes ${businessInfo.values
                 ?.filter((t: Selectable) => t?.selected)
                 .map(
                   (t: Selectable) => t.label
                 )} and communicates with a ${businessInfo.toneAndVoice
                 ?.filter((t: Selectable) => t?.selected)
                 .map((t: Selectable) => t.label)} voice. Known for its ${
                 businessInfo.style
               }, it embodies a ${businessInfo.persona
                 ?.filter((t: Selectable) => t?.selected)
                 .map((t: Selectable) => t.label)} persona, effectively serving the ${
                 businessInfo.vertical
               } vertical."`,
      }),
    })
      .then((response) => response.json())
      .then((_data) => {
        const { choices } = _data.response;
        const { content } = choices[0].message;
        setSummary(content);

        setBusinessInfo({
          ...businessInfo,
          summary: content,
        });
      })
      .catch((_error) => {});
  };

  const checkSelectedTickets = () => {
    const brandData = ['values', 'persona', 'toneAndVoice'];

    for (let i = 0; i < brandData.length; i++) {
      const selectedData =
        brandData[i] === 'values'
          ? businessInfo.values?.filter((ticket) => ticket?.selected)
          : brandData[i] === 'persona'
            ? businessInfo.persona?.filter((ticket) => ticket?.selected)
            : businessInfo.toneAndVoice?.filter((ticket) => ticket?.selected);
      if (selectedData?.length === 0) return false;
    }
    return true;
  };

  const loadBrandImage = async () => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setLogo(fileReader.result as string);
    };
    if (businessInfo?.brandLogo && typeof businessInfo?.brandLogo !== 'string') {
      fileReader.readAsDataURL(businessInfo?.brandLogo);
    } else if (typeof businessInfo?.brandLogo === 'string' && businessInfo?.brandLogo !== '') {
      setLogo(businessInfo?.brandLogo);
    } else if (businessInfo?.logo !== undefined && businessInfo?.logo !== '') {
      setLogo(`https://storage.googleapis.com/matchpoint-brands-logos/${businessInfo?.logo}`);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (checkSelectedTickets()) {
      handleSave();
    } else setRunValidation((prev) => prev + 1);
  };

  useEffect(() => {
    getSummary();
    loadBrandImage();
  });

  return (
    <>
      <FormsContainer>
        <form onSubmit={handleSubmit} id="review_form">
          <p className="text-xl text-[#111928] font-semibold mb-5">
            Here&apos;s what Matchpoint knows about your business:
          </p>
          {logo !== '' && (
            <div className="mb-5">
              <div className="mb-5 flex items-center gap-3">
                <label title="logo" className="block text-base font-medium text-gray-900">
                  Logo
                </label>
                <button onClick={() => setFormStep(2)}>
                  <img src="/edit-outline.svg" alt="brand" className="w-4 h-4" />
                </button>
              </div>
              <img src={logo} alt="logo" className="w-[150px] h-auto" />
            </div>
          )}
          {logo === '' && (
            <div className="mb-5">
              <div className="mb-5 flex items-center gap-3">
                <label title="logo" className="block text-base font-medium text-gray-900">
                  Brand Name
                </label>
                <button onClick={() => setFormStep(1)}>
                  <img src="/edit-outline.svg" alt="brand" className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-lg capitalize text-[#111928]">{businessInfo.name}</h2>
            </div>
          )}
          {(businessInfo?.brandColors?.length ?? 0) > 0 && (
            <div className="mb-5">
              <div className="mb-5 flex items-center gap-3">
                <label className="block text-base font-medium text-gray-900">Brand Colors</label>
                <button onClick={() => setFormStep(2)}>
                  <img src="/edit-outline.svg" alt="brand" className="w-4 h-4" />
                </button>
              </div>
              <div className="gap-3 overflow-x-auto whitespace-nowrap">
                {businessInfo?.brandColors?.map((color: string, index: number) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full inline-block mr-2 shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
          <div>
            <label title="logo" className="block text-base font-medium text-gray-900">
              Business and Brand Summary
            </label>
            <div className="bg-[#EBF5FF] p-4 my-5 rounded-md">
              <p>
                {summary && <>{summary}</>}
                {!summary && <>Brand industry & vertical information is being fetched...</>}
              </p>
            </div>
          </div>
          <BrandDetailsReview stepHandler={setFormStep} />
        </form>
      </FormsContainer>
      <div className="flex justify-between mb-10 w-full">
        <BackButton onClick={handleBack} />
        <button
          className="bg-[#5145CD] hover:bg-[#6875F5] text-white px-5 py-3 rounded-lg font-bold mb-0 ml-auto md:w-auto w-full flex items-center justify-center disabled:cursor-not-allowed"
          disabled={saving}
          form="review_form"
        >
          {saving ? (
            <CircularProgress sx={{ color: '#ffffff' }} size={25} thickness={5} />
          ) : (
            'Save Profile and Start Campaign'
          )}
        </button>
      </div>
    </>
  );
};

export default ReviewForm;
