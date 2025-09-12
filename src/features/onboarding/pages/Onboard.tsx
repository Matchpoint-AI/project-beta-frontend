/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import OnboardForms from '../components/OnboardForms';
import BrandProfileEdit from '../../brand/components/BrandProfileEdit';
import { CircularProgress } from '@mui/material';

const Onboard = () => {
  const { profile, isLoading } = useAuth();
  const [editSavedBrand, toggleEdit] = useState(false);
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
        <CircularProgress sx={{ color: '#42389D' }} size={80} thickness={5} />
        <h1 className="text-2xl font-semibold leading-9 text-gradient">We are loading your data</h1>
      </div>
    );
  }
  return (
    <div className=" min-w-full min-h-screen bg-gradient-to-b from-[#F1FDFF] to-[#F5D9FF] items-center lg:items-start md:pl-[100px] lg:pl-[100px] md:pr-[20px] lg:pr-[20px] p-4 lg:p-0">
      {profile?.hasBrand && !editSavedBrand ? (
        <BrandProfileEdit {...{ toggleEdit, hasBrand: profile.hasBrand }} />
      ) : (
        <OnboardForms edit={editSavedBrand} />
      )}
    </div>
  );
};

export default Onboard;
