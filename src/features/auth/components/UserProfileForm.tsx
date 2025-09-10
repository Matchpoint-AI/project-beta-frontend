import React, { FormEventHandler, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import updateUserProfile from '../../../helpers/updateUserProfile';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
import { CircularProgress } from '@mui/material';
import EditProfileInput from '../../../shared/components/inputs/EditProfileInput';

export default function UserProfileForm({ edit }: { edit: boolean }) {
  const { profile, setProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestError, setRequestError] = useState<string | null>('');
  const [submiting, setSubmiting] = useState(false);

  useEffect(() => {
    setName(profile?.name ?? '');
    setEmail(profile?.email ?? '');
  }, [profile]);

  const nameIsInvalid = useCallback((newName: string) => {
    if (newName.trim() === '') return true;
    return false;
  }, []);

  const emailIsInvalid = useCallback((newEmail: string) => {
    return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newEmail);
  }, []);

  const passwordIsInvalid = useCallback((newPassword: string) => {
    if (newPassword.length >= 1 && newPassword.length <= 5) return true;
    if (newPassword.length == 0) return null;
    return false;
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    try {
      if (nameIsInvalid(name) || emailIsInvalid(email) || passwordIsInvalid(password)) return;
      else {
        const { email: updatedEmail, name: updatedName } = await updateUserProfile(
          profile?.token ?? '',
          name,
          email,
          password
        );
        setProfile({
          ...profile,
          id: profile?.id ?? '',
          role: profile?.role ?? '',
          email: updatedEmail,
          name: updatedName,
        });
        setRequestError(null);
        setTimeout(() => setRequestError(''), 2000);
      }
    } catch (_error) {
      setRequestError((error as Error).message);
    }
    setSubmiting(false);
  };

  return (
    <>
      <form className="mt-16" onSubmit={handleSubmit}>
        <div className="flex sm:flex-row flex-col sm:gap-0 gap-3 sm:items-center items-start my-6 justify-between max-w-[633px]">
          <div className="text-gray-600 text-xs font-semibold leading-[18px]">NAME</div>
          {edit ? (
            <EditProfileInput
              type="text"
              value={name}
              setValue={setName}
              placeholder="New Name"
              subject="name"
              validateInput={nameIsInvalid}
            />
          ) : (
            <div className="text-gray-800 text-base font-medium leading-normal py-[11px] pr-[11px] sm:w-4/5 w-full max-w-[550px] overflow-x-auto">
              {profile?.name}
            </div>
          )}
        </div>
        <div className="max-w-[633px] h-[0px] border-[0.5px] border-gray-400"></div>
        <div className="flex sm:flex-row flex-col sm:gap-0 gap-3 sm:items-center items-start my-6 justify-between max-w-[633px]">
          <div className="text-gray-600 text-xs font-semibold leading-[18px]">EMAIL</div>
          {edit ? (
            <EditProfileInput
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="New Email"
              subject="email"
              validateInput={emailIsInvalid}
            />
          ) : (
            <div className="text-gray-800 text-base font-medium leading-normal py-[11px] pr-[11px] sm:w-4/5 w-full max-w-[550px] overflow-x-auto">
              {profile?.email}
            </div>
          )}
        </div>
        <div className="max-w-[633px] h-[0px] border-[0.5px] border-gray-400"></div>
        <div className="flex sm:flex-row flex-col sm:gap-0 gap-3 sm:items-center items-start my-6 justify-between max-w-[633px]">
          <div className="text-gray-600 text-xs font-semibold leading-[18px]">PASSWORD</div>
          {edit ? (
            <EditProfileInput
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="New Password"
              subject="password"
              validateInput={passwordIsInvalid}
            />
          ) : (
            <div className="text-gray-800 text-base font-medium leading-normal py-[11px] pr-[11px] sm:w-4/5 w-full max-w-[550px] overflow-x-auto">
              **************
            </div>
          )}
        </div>
        <div className="max-w-[633px] h-[0px] border-[0.5px] border-gray-400"></div>
        <button
          type="submit"
          disabled={!edit || submiting}
          className="w-[98px] h-12 bg-main-purple  rounded-lg justify-center items-center gap-2 inline-flex text-white text-base font-medium leading-normal mt-32 disabled:cursor-not-allowed"
          style={{
            opacity: edit ? '1' : '.4',
          }}
        >
          {submiting ? (
            <CircularProgress sx={{ color: '#ffffff' }} size={25} thickness={5} />
          ) : (
            'Save'
          )}
        </button>
      </form>
      <ErrorToast
        open={requestError === null || requestError !== ''}
        onClose={() => setRequestError('')}
        message={requestError ?? 'Profile updated successfully'}
        success={true}
      />
    </>
  );
}
