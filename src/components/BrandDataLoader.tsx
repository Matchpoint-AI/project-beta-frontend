import React, { useContext, useEffect, useState } from 'react';
import { getServiceURL } from '../helpers/getServiceURL';
import { useAuth } from '../features/auth/context/AuthContext';
import { BrandContext } from '../context/BrandContext';
// import { useNavigate } from "react-router-dom";

import { RiErrorWarningLine } from 'react-icons/ri';
import convertToChipsArray from '../helpers/convertToChips';

export default function BrandDataLoader({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const { setBusinessInfo } = useContext(BrandContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log('BrandDataLoader useEffect running, profile:', profile);
    if (!profile || !profile?.token) return;

    const fetchBrandData = async () => {
      console.log('fetchBrandData called');
      setLoading(true);
      setError(false);
      const endpointUrl = getServiceURL('data');
      const response = await fetch(endpointUrl + '/api/v1/data/get/complex?query_kind=brand_data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${profile?.token}`,
        },
      });
      console.log('Brand data response status:', response.status);
      if (!response.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      const data = await response.json();
      console.log('Brand data fetched:', data);
      if (data.length > 0) {
        console.log('Raw brand_variables:', data[0].brand_variables);
        const convertedValues = convertToChipsArray(
          (data[0].brand_variables.values || []).filter(Boolean)
        );
        const convertedPersona = convertToChipsArray(
          (data[0].brand_variables.persona || []).filter(Boolean)
        );
        const convertedToneAndVoice = convertToChipsArray(
          (data[0].brand_variables.tov || []).filter(Boolean)
        );
        console.log('Converted values:', convertedValues);
        console.log('Converted persona:', convertedPersona);
        console.log('Converted toneAndVoice:', convertedToneAndVoice);

        // Log product features
        console.log('Product features from backend:', data[0].brand_variables.product_features);
        console.log('Key features from backend:', data[0].brand_variables.key_features);

        setBusinessInfo({
          id: data[0].id,
          name: data[0].biz_variables.brand_name,
          website: data[0].biz_variables.brand_website,
          industry: data[0].biz_variables.industry,
          vertical: data[0].biz_variables.vertical,
          physical_locations: data[0].brand_variables.locations,
          locations_fetched: data[0].brand_variables.isFetched,
          checkZip: data[0].brand_variables.checkZip,
          brandColors: data[0].brand_variables.colors?.slice(0, 3) || [],
          mission: data[0].brand_variables.mission,
          summary: data[0].brand_variables.summary,
          isSaved: true,
          logo: data[0].biz_variables.brand_logo,
          products: data[0].brand_variables.products,
          product_features: data[0].brand_variables.product_features ?? [],
          product_description: data[0].brand_variables.product_description ?? '',
          product_link: data[0].brand_variables.product_link ?? '',
          start_date: data[0].brand_variables.start_date ?? '',
          durationNum: data[0].brand_variables.durationNum ?? 0,
          persona: convertedPersona,
          toneAndVoice: convertedToneAndVoice,
          values: convertedValues,
        });
      } else {
        setBusinessInfo({
          name: '',
          website: '',
          product_features: [],
          product_description: '',
          product_link: '',
          key_features: [],
          isFetched: false,
          start_date: '',
          durationNum: 0,
        });
      }
      setSuccess(true);
      setLoading(false);
    };

    fetchBrandData();
  }, [profile]);

  if (!profile || profile.token === '') {
    return <>{children}</>;
  }

  return (
    <>
      {!loading && success && children}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#F1FDFF] to-[#F5D9FF] min-h-screen">
          <RiErrorWarningLine size={64} color="#F05252" />
          <h1 className="font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]">
            Error
          </h1>
          <p className="text-[#30175A] md:text-lg text-base text-center max-w-[600px]">
            Unexpected error, please reload the page if the problem persists try again later!
          </p>
          <button
            className="flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      )}
    </>
  );
}
