/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { CampaignContext } from '../../features/campaign/context/CampaignContext';
import CustomDialog from '../../features/campaign/components/CustomDialog';
import { useNavigate } from 'react-router-dom';
import FormsContainer from '../../shared/components/layout/FormsContainer';
import BackButton from '../../shared/components/buttons/BackButton';
import ApproveButton from '../../shared/components/buttons/ApproveButton';
import CampaignSetupCompleteDialog from '../../features/campaign/components/CampaignSetupCompleteDialog';
import { getServiceURL } from '../../shared/utils/getServiceURL';
import { SparklesMessage } from '../../shared/components/ui/SparklesMessage';
import CampaignBriefTimingBlock from '../../features/campaign/components/CampaignBriefTimingBlock';
import dayjs from 'dayjs';
import { MdEdit } from 'react-icons/md';
import CampaignDetails from '../../features/campaign/components/CampaignDetails';
import CampaignSchedule from '../../features/campaign/components/CampaignSchedule';
import CampaignDetailsBlock from '../../features/campaign/components/CampaignDetailsBlock';
import handleNavigate from '../../shared/utils/handleNavigate';
import { useAuth } from '../../features/auth/context/AuthContext';
import { trackCampaignBriefCreation } from '../../shared/utils/analytics';

type CampaignBriefFormProps = {
  onClose?: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleBack: () => void;
  handleApprove: () => void;
  setTiming: React.Dispatch<React.SetStateAction<string>>;
  setService: React.Dispatch<React.SetStateAction<string>>;
};

const CampaignBriefForm: React.FC<CampaignBriefFormProps> = ({
  setCurrentStep,
  handleBack,
  setTiming,
  setService,
  handleApprove: parentHandleApprove,
}) => {
  const { businessInfo, setBusinessInfo }: any = useContext(BrandContext);
  const [isOpen, setIsOpen] = useState<number>(0);
  const [sent, setSent] = useState<boolean>(false);

  const { campaignInfo, setCampaignInfo }: any = useContext(CampaignContext);

  const [campaignSummary, setCampaignSummary] = useState('');
  const { profile } = useAuth();
  const navigate = useNavigate();

  // const prompt = `Based on the data we've collected for ${
  //   businessInfo.name
  // } which you can find here ${JSON.stringify({
  //   businessInfo,
  // })} including what we scraped in step 1 about the campaign: ${JSON.stringify({
  //   campaignInfo,
  // })} please compile that with the user input variables from the variable list to summarize the campaign.  You can start with the selected campaign summary, product or service. Make the response the campaign summary and just that.`;

  const prompt = `Based on the data for ${
    businessInfo.name
  }, please create a campaign strategy of 60 words or less that:
1. Summarizes the industry and business goals
2. Outlines key products/services
3. Describes the target consumer

Use this data:
Business Details: ${JSON.stringify(businessInfo)}
Campaign Information: ${JSON.stringify(campaignInfo)}

Format the response as a single cohesive summary paragraph following this example style:
Get ${campaignInfo?.audienceGender} who are interested in ${
    campaignInfo?.audienceInterests
  } to see ${businessInfo.name}'s ${
    businessInfo.products
  } as the best solution for them by showing them ${
    campaignInfo?.product_features
  } supports exactly what they need.`;

  const handleApprove = () => {
    setSent(true);
    if (campaignInfo?.campaign_type && campaignInfo?.durationNum) {
      trackCampaignBriefCreation(campaignInfo?.campaign_type, campaignInfo?.durationNum, 0);
    }
    // Call the parent's handleApprove function to continue the flow
    if (parentHandleApprove) {
      parentHandleApprove();
    }
  };
  const generateSummary = async () => {
    if (campaignInfo?.summary !== undefined) {
      setCampaignSummary(campaignInfo?.summary);
      return;
    }
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
        setCampaignSummary(content);
        setCampaignInfo((prev: any) => ({ ...prev, summary: content }));
      })
      .catch((_error) => {});
  };

  const editTable = [1, 3, 2, 4];

  useEffect(() => {
    // Fetch initial data when component mounts
    generateSummary();
  }, []);

  const handleRedirect = () => {
    navigate('/');
  };
  const onClose = () => {
    setCampaignInfo({});
    handleNavigate(profile?.id ?? '', '/dashboard', navigate);
  };

  return (
    <>
      {isOpen !== 0 && (
        <CustomDialog
          onClose={handleRedirect}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setCurrentStep={setCurrentStep}
          setTiming={setTiming}
          setService={setService}
        />
      )}
      {sent && (
        <CampaignSetupCompleteDialog
          onClose={onClose}
          setCurrentStep={setCurrentStep}
          open={sent}
        />
      )}
      <FormsContainer className={`${isOpen ? 'blur-md' : ''}`}>
        {/* <form> */}
        <div className="mb-5">
          {businessInfo?.logo !== '' ? (
            <img
              src={`https://storage.googleapis.com/matchpoint-brands-logos/${businessInfo?.logo}`}
              alt="logo"
              className="w-[100px] h-auto ml-auto"
            />
          ) : (
            <div className="mb-5 flex ml-auto">
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {businessInfo?.name}
              </h1>
            </div>
          )}
        </div>
        <div className="mb-5 flex justify-center">
          <h1 className="text-lg font-semibold text-gray-900 capitalize">{campaignInfo?.name}</h1>
        </div>
        <div className="mb-5 flex md:flex-row flex-col gap-[14px]">
          <CampaignBriefTimingBlock title="Created">
            <span className="font-bold text-sm leading-5">
              {dayjs(campaignInfo?.created_at ?? Date.now()).format('MM/DD/YY')}
            </span>
          </CampaignBriefTimingBlock>
          <CampaignBriefTimingBlock title="campaign timing">
            <p className="text-sm font-normal">
              <span className="font-bold">{campaignInfo.duration}</span> {campaignInfo?.startDate} -{' '}
              {dayjs(campaignInfo?.startDate)
                .add(campaignInfo?.durationNum, 'weeks')
                .format('MM/DD/YY')}{' '}
            </p>
          </CampaignBriefTimingBlock>
        </div>
        {/* <div className="mb-5">
          <label
            title="email"
            className="block mb-2 leading-7 text-xl font-semibold text-gray-900"
          >
            Overview
          </label>
          <SparklesMessage>
            Based on the information collected to this point. Here's the brief
            we've built.
            <br />
            You can <strong>click any block to edit</strong> or approve and
            we'll start generating your content.
          </SparklesMessage>
        </div> */}
        <div className="mb-5">
          <div className=" bg-[#FDF2F8] p-4 rounded-md">
            <h1 className="font-semibold text-sm mb-1 ">Campaign Strategy:</h1>
            <p className="text-sm text-gray-900">
              {campaignSummary ? campaignSummary : 'Campaign Strategy is being generated...'}
            </p>
          </div>
        </div>
        <h1 className="font-semibold text-lg mb-1 ">Campaign Details</h1>
        {businessInfo?.name && (
          <CampaignDetailsBlock
            title="Brand"
            text={businessInfo?.name}
            review={campaignInfo?.campaign_brief}
          />
        )}

        {campaignInfo?.product && (
          <CampaignDetailsBlock
            title="Brand, Service or Product to advertise:"
            text={campaignInfo?.product}
            review={campaignInfo?.campaign_brief}
          />
        )}
        <CampaignDetails />
        <CampaignSchedule />
      </FormsContainer>
      {campaignInfo?.campaign_brief !== true && (
        <div className={`flex justify-between mb-10 w-full ${isOpen ? 'blur-md' : ''}`}>
          <BackButton onClick={() => handleBack()} />
          <ApproveButton double={false} handleApproveAll={handleApprove} loading={false} />
        </div>
      )}
    </>
  );
};

export default CampaignBriefForm;
