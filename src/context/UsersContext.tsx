import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { getServiceURL } from '../helpers/getServiceURL';

type User = {
  id: string;
  name: string;
  email: string;
  business: string;
  plan: string;
  totalCampaigns: number;
  created_at: number;
};

type UsersContextType = {
  users: User[];
  total: number;
  error: string;
  handleNextPage: () => void;
};

export const UsersContext = createContext<UsersContextType>(null!);

export function UsersContextProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string>('');
  const { profile } = useAuth();

  const fetchUsers = async (offset?: number) => {
    try {
      if (!profile?.token) {
        setError('Authentication required');
        return;
      }
      if (profile.role !== 'ADMIN') {
        setError('Admin access required');
        return;
      }
      const serviceUrl = getServiceURL('data');
      let endpointUrl = `${serviceUrl}/api/v1/users`;

      if (offset) endpointUrl += `?offset=${offset}`;
      const response = await fetch(endpointUrl, {
        headers: {
          Authorization: `Bearer ${profile.token}`,
        },
      });

      if (!response.ok) {
        setError('Error fetching users');
        return;
      }

      const data = await response.json();

      if (users.length === 0) setUsers(data.users);
      else setUsers((old) => [...old, ...data.users]);
      if (data.totalUsers > 0) setTotal(data.totalUsers);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    }
  };

  const handleNextPage = () => {
    if (users.length > 0) {
      fetchUsers(users.at(-1)?.created_at);
    }
  };

  useEffect(() => {
    if (profile?.token) {
      fetchUsers();
    }
  }, [profile]);

  return (
    <UsersContext.Provider value={{ users, total, error, handleNextPage }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => {
  return useContext(UsersContext);
};
