// UserProfile.tsx

import React, { useState } from 'react';
import UserProfileForm from '../components/auth/UserProfileForm';

const UserProfile: React.FC = () => {
  const [edit, setEdit] = useState(false);

  return (
    <div className="w-full h-full">
      <div className="flex w-full lg:flex-row flex-col">
        <div className="flex-grow flex flex-col sm:p-8 p-0 text-[#747474] ">
          <div className="p-3">
            <div className="w-[211px] bg-gradient-to-r bg-clip-text text-transparent from-[#681DBA] to-[#FF43E1] text-2xl font-semibold leading-9">
              My Profile
            </div>
            <div className="mb-4 mt-8 flex items-center gap-3">
              <div className="text-zinc-600 text-[17px] font-bold leading-relaxed">BASIC INFO</div>
              <button
                className="text-fuchsia-500 text-xs font-bold leading-[18px]"
                onClick={() => setEdit((old) => !old)}
              >
                EDIT
              </button>
            </div>
            <div className="w-full h-[0px] border border-violet-800"></div>
            <UserProfileForm edit={edit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
