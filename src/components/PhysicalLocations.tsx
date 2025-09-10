import React, { useState, useContext, useEffect } from 'react';
import { SparklesMessage } from './shared/SparklesMessage';
import ZipCodeInput from './shared/Inputs/ZipCodeInput';
import { BrandContext } from '../features/brand/context/BrandContext';

interface PhysicalLocationsProps {
  physicalLocations: string[];
  setPhysicalLocations: any;
}

export default function NoPhysicalLocations(props: PhysicalLocationsProps) {
  const { businessInfo, setBusinessInfo }: any = useContext(BrandContext);
  const [checkZip, setCheckZip] = useState<boolean>(false);

  const handleCheckBox = async () => {
    setBusinessInfo((prev: any) => ({
      ...prev,
      checkZip: !checkZip,
    }));
    setCheckZip(!checkZip);
  };

  useEffect(() => {
    if (businessInfo.checkZip !== undefined) setCheckZip(businessInfo.checkZip);
  }, [businessInfo]);

  return (
    <>
      <SparklesMessage>
        We&apos;ve not detected any physical locations for your business.
      </SparklesMessage>
      {checkZip === true && (
        <div className="my-10">
          <ZipCodeInput
            currentValues={props.physicalLocations}
            setCurrentValues={props.setPhysicalLocations}
          />
        </div>
      )}
      <div className="flex items-start my-5">
        <div className="flex items-center h-5">
          <input
            title="location"
            id="checkZip"
            type="checkbox"
            checked={checkZip}
            onChange={handleCheckBox}
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
          />
        </div>
        <label
          htmlFor="checkZip"
          title="location"
          className="ms-2 text-sm font-medium text-[#111928]"
        >
          Add physical locations by zip code
        </label>
      </div>
    </>
  );
}

export function PhysicalLocationsFound(props: PhysicalLocationsProps) {
  const [checkZip, setCheckZip] = useState<boolean>(false);
  const { businessInfo, setBusinessInfo }: any = useContext(BrandContext);

  const handleCheckBox = async () => {
    setBusinessInfo((prev: any) => {
      prev.checkZip = !checkZip;
      return prev;
    });
    setCheckZip(!checkZip);
  };

  useEffect(() => {
    if (businessInfo.checkZip !== undefined) setCheckZip(businessInfo.checkZip);
  }, [businessInfo]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <SparklesMessage>
          We’ve detected your brand has physical locations in these areas.
        </SparklesMessage>
        <p className="text-sm text-[#6B7280]">
          You may remove locations as you wish. To add a location please type the zip code of the
          city it’s in.
        </p>
        {!checkZip && (
          <ZipCodeInput
            currentValues={props.physicalLocations}
            setCurrentValues={props.setPhysicalLocations}
          />
        )}
        <div className="flex items-center justify-start gap-1 w-full ">
          <input
            title="location"
            id="checkZip"
            type="checkbox"
            checked={checkZip}
            onChange={handleCheckBox}
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
          />
          <label
            htmlFor="checkZip"
            title="location"
            className="ms-2 text-sm font-medium text-[#111928]"
          >
            My brand does not have physical locations.
          </label>
        </div>
      </div>
    </>
  );
}

export function PhysicalLocations(props: PhysicalLocationsProps) {
  return (
    <div className="my-10">
      <h2 className="text-xl font-medium text-gray-900 capitalize mb-3">locations</h2>
      {props.physicalLocations.length > 0 ? (
        <PhysicalLocationsFound {...props} />
      ) : (
        <NoPhysicalLocations {...props} />
      )}
    </div>
  );
}
