import React from 'react';

import { useSearchParams } from 'react-router-dom';
import EmailInputForReset from './EmailInputForReset';
import PasswordResetForm from './PasswordResetForm';

interface ResetPasswordProps {
  setOpen: (value: { open: boolean; error: boolean; message: string }) => void;
}

export default function ResetPassword({ setOpen }: ResetPasswordProps) {
  const [params] = useSearchParams();
  const actionCode = params.get('oobCode');

  return (
    <div className="flex flex-col items-center py-20 bg-gradient-to-br from-white to-[#b4b1d5] h-screen">
      <div className="flex flex-col w-[90%] md:w-[600px]">
        <h1 className="sm:text-2xl text-xl text-start font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#681DBA] to-[#FF43E1] mt-10">
          Welcome to Matchpoint.
          <br className="sm:hidden block" /> Let’s get you in!
        </h1>
        {actionCode && <PasswordResetForm setOpenToast={setOpen} />}
        {!actionCode && <EmailInputForReset setOpenToast={setOpen} />}
      </div>
    </div>
  );
}
