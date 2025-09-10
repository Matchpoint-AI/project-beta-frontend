import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthForm from './AuthForm';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';

const AuthUIWrapper = ({ login = false }: { login: boolean }) => {
  const [authError, setAuthError] = useState<string | React.JSX.Element>('');

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center py-20 bg-gradient-to-br from-white to-[#b4b1d5] min-h-screen ">
        <div className="flex flex-col w-[90%] md:w-[600px]">
          <h1 className="sm:text-2xl text-xl text-start font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#681DBA] to-[#FF43E1] mt-10">
            Welcome to Matchpoint.
            <br className="sm:hidden block" /> Let’s get you in!
          </h1>
          <div className="w-full bg-white mt-5 py-10 rounded-lg mb-14">
            <AuthForm login={login} setAuthError={setAuthError} />
          </div>
        </div>
      </div>
      <ErrorToast message={authError} open={authError !== ''} onClose={() => setAuthError('')} />
      <Footer />
    </>
  );
};

export default AuthUIWrapper;
