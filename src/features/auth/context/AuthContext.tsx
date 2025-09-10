import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useAuthentication } from '../../../firebase';
import { getServiceURL } from '../../../helpers/getServiceURL';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
  plan?: string;
  is_admin?: boolean;
  hasBrand?: boolean;
}

interface AuthContextType {
  profile: Profile;
  setProfile: (profile: Profile | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (
    token: string,
    email: string,
    remember: boolean,
    id: string,
    name: string,
    plan?: string,
    role?: string,
    is_admin?: boolean,
    hasBrand?: boolean
  ) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const cookies = new Cookies();

/**
 * Decode JWT token to get expiration time
 * @param token - JWT token string
 * @returns expiration timestamp or null if invalid
 */
const getTokenExpiration = (token: string): number | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch (_error) {
    // Failed to decode token
    return null;
  }
};

/**
 * Check if token will expire soon (within 5 minutes)
 * @param token - JWT token string
 * @returns true if token expires soon
 */
const isTokenExpiringSoon = (token: string): boolean => {
  const exp = getTokenExpiration(token);
  if (!exp) return true; // Assume expired if we can't decode

  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return exp - now < fiveMinutes;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthentication();
  const location = useLocation();
  const navigate = useNavigate();

  // Memoized token refresh function to prevent unnecessary re-renders
  const performTokenRefresh = useCallback(async (): Promise<string | null> => {
    if (!user) {
      return null;
    }

    try {
      const newToken = await user.getIdToken(true); // Force refresh

      // Update profile with new token
      if (profile) {
        const updatedProfile = { ...profile, token: newToken };
        setProfile(updatedProfile);
      }

      // Store new token in cookie
      cookies.set('token', newToken, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      return newToken;
    } catch (_error) {
      // Token refresh failed
      return null;
    }
  }, [user, profile]);

  const login = (
    token: string,
    email: string,
    remember: boolean,
    id: string,
    name: string,
    plan?: string,
    role?: string,
    is_admin?: boolean,
    hasBrand?: boolean
  ) => {
    const newProfile: Profile = {
      id,
      email,
      name,
      role: role || 'USER',
      token,
      plan,
      is_admin,
      hasBrand,
    };
    setProfile(newProfile);

    // Set cookie with proper options
    cookies.set('token', token, {
      path: '/',
      maxAge: remember ? 30 * 24 * 60 * 60 : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
    });

    // Cookie set

    if (newProfile.hasBrand) {
      navigate('/dashboard');
    } else {
      navigate('/onboard');
    }
  };

  const validateToken = async () => {
    try {
      setIsLoading(true);
      // If we have a Firebase user, always use their token
      if (user) {
        const token = await user.getIdToken(true);
        const response = await fetch(`${getServiceURL('data')}/api/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const data = await response.json();
        const newProfile = { ...data, token };
        setProfile(newProfile);

        // Set cookie with proper options
        cookies.set('token', token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        // Cookie set from Firebase
        setIsLoading(false);
        return;
      }

      // If no Firebase user, try using stored token
      const storedToken = cookies.get('token');

      if (!storedToken) {
        setProfile(null);
        setIsLoading(false);
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          navigate('/login');
        }
        return;
      }

      const response = await fetch(`${getServiceURL('data')}/api/v1/user`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        // Only clear token and navigate if we're on a protected route
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          cookies.remove('token', { path: '/' });
          setProfile(null);
          navigate('/login');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const newProfile = { ...data, token: storedToken };
      setProfile(newProfile);

      // Refresh the token in the cookie
      cookies.set('token', storedToken, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
      setIsLoading(false);
    } catch (_error) {
      // Only clear token and navigate if we're on a protected route
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        cookies.remove('token', { path: '/' });
        setProfile(null);
        navigate('/login');
      }
      setIsLoading(false);
    }
  };

  // Run validation when user changes
  useEffect(() => {
    validateToken();
  }, [user]);

  // Intelligent token refresh system
  useEffect(() => {
    if (!user || !profile?.token) return;

    const scheduleTokenRefresh = () => {
      const currentToken = profile.token;
      if (!currentToken) return;

      // Check if token is expiring soon
      if (isTokenExpiringSoon(currentToken)) {
        performTokenRefresh().catch((_error) => {
          logout();
        });
        return;
      }

      // Calculate next refresh time based on token expiration
      const expiration = getTokenExpiration(currentToken);
      if (expiration) {
        const now = Date.now();
        const timeUntilExpiry = expiration - now;
        const refreshTime = Math.max(timeUntilExpiry - 10 * 60 * 1000, 5 * 60 * 1000); // Refresh 10 min before expiry, but at least 5 min from now

        const refreshTimeout = setTimeout(async () => {
          const newToken = await performTokenRefresh();
          if (!newToken) {
            logout();
          }
        }, refreshTime);

        return () => clearTimeout(refreshTimeout);
      }
    };

    // Schedule initial refresh
    const cleanup = scheduleTokenRefresh();

    // Also set up a backup interval every 30 minutes as a safety net
    const backupInterval = setInterval(
      async () => {
        const currentToken = profile.token;
        if (currentToken && isTokenExpiringSoon(currentToken)) {
          const newToken = await performTokenRefresh();
          if (!newToken) {
            logout();
          }
        }
      },
      30 * 60 * 1000
    );

    return () => {
      cleanup?.();
      clearInterval(backupInterval);
    };
  }, [user, profile?.token, performTokenRefresh]);

  const logout = () => {
    cookies.remove('token', { path: '/' });
    setProfile(null);
    navigate('/login');
  };

  const isAuthenticated = !!profile?.token;

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        isAuthenticated,
        isLoading,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
