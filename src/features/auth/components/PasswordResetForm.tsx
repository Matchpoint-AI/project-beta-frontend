import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthentication } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import posthog from '../../../helpers/posthog';
import { useAuth } from '../context/AuthContext';

interface ToastState {
  open: boolean;
  error: boolean;
  message: string;
}

interface PasswordResetFormProps {
  setOpenToast: (toast: ToastState) => void;
}

export default function PasswordResetForm({ setOpenToast }: PasswordResetFormProps) {
  const [params] = useSearchParams();
  const { auth } = useAuthentication();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [reseting, setReseting] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleChangeConfirmPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;

    setConfirmPassword(value);
    setError(false);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setReseting(true);
    const mode = params.get('mode');

    if (confirmPassword !== password) {
      setError(true);
      return;
    }

    if (mode === 'resetPassword') {
      const code = params.get('oobCode');

      if (!code) return navigate('/reset-password');

      verifyPasswordResetCode(auth!, code)
        .then((_email) => {
          confirmPasswordReset(auth!, code, password)
            .then(() => {
              setOpenToast({
                open: true,
                error: false,
                message: 'Password reset successful!',
              });
              if (posthog.__loaded) {
                posthog.capture('Form Submitted', {
                  distinct_id: profile.id,
                  form_name: 'password reset', // Replace with actual form name
                });
              }
              setTimeout(() => navigate('/login'), 2000);
            })
            .catch((e) => {
              const authError = e as FirebaseError;
              let message = 'Password reset failed!';
              if (authError.code === 'auth/weak-password')
                message = 'Password should be at least 6 characters';
              setOpenToast({
                open: true,
                error: true,
                message,
              });
            });
        })
        .catch(() => {
          setOpenToast({
            open: true,
            error: true,
            message: 'Password reset failed!',
          });
          setTimeout(() => navigate('/login'), 2000);
        })
        .finally(() => {
          setReseting(false);
        });
    }
  };

  return (
    <div className="w-full bg-white mt-5 py-10 rounded-lg mb-14">
      <form className="sm:px-10 px-3" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none "
            placeholder="New Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="confirm_password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none "
            placeholder="Confirm Password"
            required
            onChange={handleChangeConfirmPassword}
            style={{
              borderColor: error ? '#F05252' : '#d1d5db',
            }}
          />
          {error && (
            <p className="text-[#F05252] font-medium text-sm mt-1">Passwords do not match</p>
          )}
        </div>
        <button className="px-3 py-2 text-white bg-[#5145CD] hover:bg-[#6875F5] font-medium rounded-lg">
          {reseting ? (
            <CircularProgress sx={{ color: '#ffffff' }} size={25} thickness={5} />
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
}
