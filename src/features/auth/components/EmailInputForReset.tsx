import React, { FormEventHandler, useState } from 'react';
import { useAuthentication } from '../../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import posthog from '../../../helpers/posthog';

export default function EmailInputForReset({
  setOpenToast,
}: {
  setOpenToast: (value: { open: boolean; error: boolean; message: string }) => void;
}) {
  const [email, setEmail] = useState('');
  const { auth } = useAuthentication();
  const { profile } = useAuth();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await sendPasswordResetEmail(auth, email);
      setOpenToast({
        open: true,
        error: false,
        message: 'password reset email was sent',
      });
      if (posthog.__loaded) {
        posthog.capture('Form Submitted', {
          distinct_id: profile?.id ?? 'anonymous_user',
          form_name: 'reset email', // Replace with actual form name
        });
      }
    } catch (e) {
      setOpenToast({
        open: true,
        error: true,
        message: 'error sending reset email',
      });
    }
  };

  return (
    <div className="w-full bg-white mt-5 py-10 rounded-lg mb-14">
      <form className="sm:px-10 px-3" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none "
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="px-3 py-2 text-white bg-[#5145CD] hover:bg-[#6875F5] font-medium rounded-lg">
          Reset Password
        </button>
      </form>
    </div>
  );
}
