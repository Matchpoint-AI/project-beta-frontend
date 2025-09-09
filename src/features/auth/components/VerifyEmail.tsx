import React, { useEffect, useState } from 'react';
import { applyActionCode } from 'firebase/auth';

import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useAuthentication } from '../../../firebase';
import { CircularProgress } from '@mui/material';
import { getServiceURL } from '../../../helpers/getServiceURL';
import Cookies from 'universal-cookie';

interface VerifyEmailProps {
  setOpen: (value: { open: boolean; error: boolean; message: string }) => void;
}

export default function VerifyEmail({ setOpen }: VerifyEmailProps) {
  const [params] = useSearchParams();
  const { auth } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const code = params.get('oobCode');
  const navigate = useNavigate();
  const cookies = new Cookies();

  console.log(auth);

  const handleVerifyEmail = async () => {
    try {
      await applyActionCode(auth!, code!);
      setVerified(true);
    } catch (e) {
      console.log(e);
      setError(true);
    }
    setLoading(false);
  };

  const resendVerification = async () => {
    const endpointUrl = getServiceURL('data');
    const email = cookies.get('email');
    const name = cookies.get('name');
    setResendLoading(true);
    const resp = await fetch(`${endpointUrl}/api/v1/user/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });
    if (!resp.ok) {
      setOpen({
        open: true,
        error: true,
        message: 'Could not resend verification link',
      });
    } else {
      setOpen({
        open: true,
        error: false,
        message: 'Verification link was sent to your email',
      });
    }
    setResendLoading(false);
  };

  useEffect(() => {
    if (!auth) return;
    if (code) {
      setLoading(true);
      handleVerifyEmail();
    } else navigate('/login');
  }, [code, navigate, auth]);

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#F9D2FF] to-[#8DA6FF] min-h-screen">
      {loading && (
        <>
          <CircularProgress sx={{ color: '#30175A' }} size={64} thickness={4} />
          <h1 className="font-medium md:text-[36px] sm:text-[28px] text-[20px] text-center text-[#30175A] capitalize mt-5">
            We are Verifying Your Email ...
          </h1>
        </>
      )}
      {verified && (
        <>
          <IoMdCheckmarkCircleOutline size={64} color="#30175A" />
          <h1 className="font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]">
            Email Verified Successfully
          </h1>
          <p className="text-[#30175A] md:text-lg text-base text-center max-w-[600px]">
            Thank you for verifying your email address! Your account is now fully activated, and you
            can explore all our features.
          </p>
          <Link
            to="/login"
            className="font-semibold mt-5 bg-[#5145CD] text-white py-3 px-8 rounded-lg"
          >
            Login
          </Link>
        </>
      )}
      {error && (
        <>
          <RiErrorWarningLine size={64} color="#F05252" />
          <h1 className="font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A] capitalize">
            Error verifying your email
          </h1>
          <p className="text-[#30175A] md:text-lg text-base text-center max-w-[600px]">
            We couldn&apos;t verify your email address. This might be due to an expired or invalid
            verification link.
            <br />
            Please try again by requesting a new verification email.
          </p>
          <button
            className="flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg w-[95%] max-w-[120px] min-h-[50px]"
            onClick={resendVerification}
          >
            {resendLoading ? (
              <CircularProgress sx={{ color: '#fff' }} size={25} thickness={5} />
            ) : (
              'Resend'
            )}
          </button>
        </>
      )}
    </div>
  );
}
