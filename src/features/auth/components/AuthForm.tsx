import {
  signInWithEmailAndPassword,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { useAuthentication } from '../../../lib/firebase';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import posthog from '../../../shared/utils/posthog';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { FirebaseError } from 'firebase/app';
import registerUser from '../../users/utils/registerUser';
import { CircularProgress } from '@mui/material';

interface AuthFormProps {
  login?: boolean;
  setAuthError: (error: string | React.ReactElement) => void;
}

export default function AuthForm({ login = false, setAuthError }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { auth } = useAuthentication();
  const { login: signin } = useAuth();
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  // const navigate = useNavigate(); // Removed unused variable
  const cookies = new Cookies();
  const data_url = import.meta.env.VITE_DATA_URL || 'https://localhost:7651';

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${data_url}/api/v1/user/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to resend verification email');
      }

      setAuthError('Verification email resent successfully!');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!auth) return;
    try {
      if (remember) {
        await setPersistence(auth, browserLocalPersistence);
      } else {
        await setPersistence(auth, browserSessionPersistence);
      }

      if (login) {
        const res = await signInWithEmailAndPassword(auth, email, password);

        if (!res.user.emailVerified) {
          await auth.signOut();
          setLoading(false);
          setAuthError(
            <span>
              please verify your email address before logging in. check your inbox for the
              verification email.
              <span
                className="block underline text-purple-600 hover:cursor-pointer mt-2"
                onClick={handleResendEmail}
              >
                Resend email
              </span>
            </span>
          );
          return;
        }
        const id_token = await res.user.getIdToken();
        const response = await fetch(`${data_url}/api/v1/user`, {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const profile = await response.json();

        if (!profile || profile.email !== res.user.email) {
          await auth.signOut();
          setLoading(false);
          setAuthError('Account not properly configured. Please contact support.');
          return;
        }

        signin(
          id_token,
          profile.email,
          remember,
          profile.uid,
          profile.name,
          profile.plan,
          profile.role,
          profile.is_admin,
          profile.hasBrand
        );

        if (posthog.__loaded) {
          posthog.capture('User Logged In', {
            distinct_id: profile.uid,
            email: profile.email,
          });
        }
      } else {
        cookies.set('email', email, {
          path: '/',
          maxAge: remember ? 30 * 24 * 60 * 60 : undefined,
        });
        cookies.set('name', name, {
          path: '/',
          maxAge: remember ? 30 * 24 * 60 * 60 : undefined,
        });

        const regRes = await registerUser(email, name, password);
        if (regRes.success) {
          setAuthError(
            regRes.message || 'Registration successful. Please check your email for verification.'
          );
        }
        if (posthog.__loaded) {
          posthog.capture('User Signed Up', {
            email: email,
            name: name,
          });
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (login) {
        const authError = error as FirebaseError;
        if (authError.code === 'auth/invalid-credential') {
          setAuthError('Invalid username or password.');
        } else if (authError.code === 'auth/too-many-requests') {
          setAuthError(
            'Access temporarily disabled due to too many attempts. Try again later or reset your password.'
          );
        } else {
          setAuthError('Login failed. Please retry.');
        }
      } else {
        if ((error as Error).message === 'User already exists') {
          setAuthError('Email already exists.');
        } else {
          setAuthError('Sign up failed. Please retry.');
        }
      }
    }
  };
  const handleConfirmPass = () => {
    if (password !== confirmPass) setError(true);
    else setError(false);
  };

  return (
    <form className="sm:px-10 px-3" onSubmit={handleSubmit}>
      <div className="mb-2 font-bold text-2xl">
        <h1>{login ? 'Login' : 'Sign Up'}</h1>
      </div>
      <div className="mb-5">
        <p className="text-sm text-gray-500">
          Get started with Matchpoint AI for free. Create content in minutes.
        </p>
      </div>
      {!login && (
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="John Doe"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {!login && (
        <div className="mb-5">
          <label
            htmlFor="repeat-password"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Confirm password
          </label>
          <input
            type="password"
            id="repeat-password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className={`shadow-sm ${
              !error ? 'border-gray-300' : 'border-red-600'
            } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `}
            required
            onBlur={handleConfirmPass}
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-5">
        {login && (
          <Link
            to="/auth/action?mode=resetPassword"
            className="capitalize text-sm font-medium text-blue-700 hover:underline"
          >
            forgot password? reset it
          </Link>
        )}
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            // required
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900">
            Remember me
          </label>
        </div>
      </div>
      <div className="flex justify-end w-full flex-col sm:flex-row gap-2">
        <button
          type="submit"
          disabled={loading}
          className={`text-white bg-[#5145CD] hover:bg-[#6875F5] font-medium rounded-lg text-sm ${
            loading ? 'px-5 py-[5.5px]' : 'px-5 py-2.5'
          } text-center w-full`}
        >
          {loading ? (
            <CircularProgress sx={{ color: '#ffffff' }} size={25} thickness={5} />
          ) : login ? (
            'Login'
          ) : (
            'Sign Up'
          )}
        </button>
        {/* <button
          type="submit"
          className="flex justify-center gap-2 text-white bg-[#1877F2] hover:bg-[#61B7F9] font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full sm:w-[49%]"
        >
          <img src="/src/assets/images/facebook.png" alt="facebook" width={20} height={20} />
          {login ? "Login with Meta" : "Continue with Meta"}
        </button> */}
      </div>
      {!login ? (
        <p className="text-sm text-gray-500 mt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          Don&apos;t have an account?{' '}
          <Link to="/signup" type="button" className="font-medium text-blue-700 hover:underline">
            Sign Up
          </Link>
        </p>
      )}
    </form>
  );
}

AuthForm.propTypes = {
  login: PropTypes.bool,
  setAuthError: PropTypes.func.isRequired,
};
