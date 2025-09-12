import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useParams } from 'react-router-dom';

export type BrandData = {
  name: string;
  website: string;
  logo: string;
  industry: string;
  vertical: string;
};

export type CampaignData = {
  id: string;
  duration: number;
  frequency: number;
  name: string;
  thread_id: string | null;
  status: 'Current' | 'Past' | 'Inactive' | 'Draft';
  created_at: string;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  plan: string;
  created_at: string;
  brand: BrandData;
  campaigns: CampaignData[];
};

export default function useFetchUserData() {
  const params = useParams();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState('');
  const { profile } = useAuth();

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    const serviceUrl = getServiceURL('data');
    const endpointUrl = `${serviceUrl}/api/v1/users/${params.id}`;

    const response = await fetch(endpointUrl, {
      headers: {
        Authorization: `Bearer ${profile?.token}`,
      },
    });

    if (!response.ok) {
      setLoading(false);
      setError('error fetching users');
      return;
    }

    const data = await response.json();
    setLoading(false);
    setData(data);
  };

  const handleRetry = () => {
    fetchUserData();
  };

  useEffect(() => {
    if (params.id) fetchUserData();
  }, [profile]);

  return [data, loading, handleRetry] as const;
}
