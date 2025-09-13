import { useLocation } from 'react-router-dom';
import { getServiceURL } from '../../utils/getServiceURL';
import InstagramIcon from './InstagramIcon';
import React, { useEffect } from 'react';

export function ConnectInstagram() {
  const location = useLocation();
  const handleConnect = async () => {
    const res = await fetch(`${getServiceURL('data')}/api/v1/instagram`);
    const data = await res.json();
    if (res.ok && data.auth_url) {
      window.open(data.auth_url, '_top');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const source = params.get('source');

    if (accessToken && source === 'instagram') {
      localStorage.setItem('instagram_access_token', accessToken);
    }
  }, [location]);
  return (
    <button
      className="
        inline-flex justify-center items-center gap-2 
        w-[250px] h-12 px-5 py-3 rounded-lg 
        bg-indigo-700 hover:bg-[#6875F5]"
      onClick={handleConnect}
    >
      <InstagramIcon />
      <div className="text-white text-sm font-medium leading-normal">Connect with Instagram</div>
    </button>
  );
}
