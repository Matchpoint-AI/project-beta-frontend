import React, { ChangeEventHandler, useContext, useEffect, useState } from 'react';
import { BrandContext } from '../context/BrandContext';
import EditBlock from '../../../shared/components/ui/EditBlock';
import BrandDetailsInput from '../../../shared/components/inputs/BrandDetailsInput';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';

export default function BrandIndustryBlock() {
  const [industry, setIndustry] = useState('');
  const [vertical, setVertical] = useState('');
  const [error, setError] = useState({
    industry: false,
    vertical: false,
  });
  const [edit, setEdit] = useState(false);
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);

  const handleIndustryChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setError((old) => ({ ...old, industry: !value }));
    setIndustry(value);
  };

  const handleVerticalChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setError((old) => ({ ...old, vertical: !value }));
    setVertical(value);
  };

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!error.industry && !error.vertical) {
      setBusinessInfo({ ...businessInfo, industry, vertical });
      setEdit(false);
    }
  };

  useEffect(() => {
    if (businessInfo?.industry) setIndustry(businessInfo?.industry);
    if (businessInfo?.vertical) setVertical(businessInfo?.vertical);
  }, [businessInfo]);

  return (
    <div className="p-[20px] bg-[#F0F5FF] rounded-lg mt-7">
      {edit && (
        <>
          <EditBlock onClick={() => setEdit(true)} disabled={edit} className="ml-auto" />
          <div>
            <div className="mb-5">
              <label htmlFor="industry" className="block mb-2 font-medium capitalize">
                industry
              </label>
              <BrandDetailsInput
                id="industry"
                type="text"
                value={industry}
                onChange={handleIndustryChange}
              />
              {error.industry && (
                <p className="text-[#F05252] text-sm font-medium mt-1">
                  Please provide your brand industry
                </p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="vertical" className="block mb-2 font-medium capitalize">
                vertical
              </label>
              <BrandDetailsInput
                id="vertical"
                type="text"
                value={vertical}
                onChange={handleVerticalChange}
              />
              {error.vertical && (
                <p className="text-[#F05252] text-sm font-medium mt-1">
                  Please provide your brand vertical
                </p>
              )}
            </div>
            <PurpleButton
              disabled={error.vertical || error.industry}
              type="button"
              onClick={handleSubmit}
              className="mt-4"
            >
              Save
            </PurpleButton>
          </div>
        </>
      )}
      {!edit && industry && (
        <>
          <div className="flex items-center justify-between align-top">
            <p className="text-sm font-medium leading-[18px]">
              {businessInfo?.name} is in the {industry} industry in the {vertical} vertical.
            </p>
            <EditBlock onClick={() => setEdit(true)} disabled={edit} />
          </div>
        </>
      )}
    </div>
  );
}
