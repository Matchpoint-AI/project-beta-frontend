// import Sidebar from "../components/Sidebar";
import React from 'react';
import { useAuthentication } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { auth } = useAuthentication();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!auth) return;

    signOut(auth)
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
      })
      .catch((_err) => {});
  };

  return (
    <div className="flex flex-col mx-auto flex-grow">
      <div className="mb-32">
        <div className="flex gap-x-14 mb-6">
          <div className="text-gray-600 text-xs font-semibold font-['Inter'] leading-[18px]">
            COMPANY
          </div>

          <img className="w-[156px] h-[18.69px]" src="/business_logo.svg" alt="logo" />
        </div>
        <div className="w-[633px] h-[0px] border-[0.5px] border-gray-400"></div>
        <div className="flex items-center my-8 gap-20">
          <div className="text-gray-600 text-xs font-semibold ">NAME</div>
          <div className="text-gray-800 text-base font-medium ">Andre Smith</div>
        </div>

        <div className="w-[633px] h-[0px] border-[0.5px] border-gray-400"></div>
        <div className="flex items-center my-8 gap-20">
          <div className="text-gray-600 text-xs font-semibold  ">EMAIL</div>
          <div className="text-gray-800 text-base font-medium  ">AndreSmith@outschool.com</div>
        </div>
        <div className="w-[633px] h-[0px] border-[0.5px] border-gray-400"></div>
        <div className="flex items-center my-8 gap-20">
          <div className="text-gray-600 text-xs font-semibold ">PASSWORD</div>
          <div className="text-gray-800 text-base font-medium ">**************</div>
        </div>
        <div className="w-[633px] h-[0px] border-[0.5px] border-gray-400"></div>
        <div className="flex items-center my-8 gap-20">
          <div className="text-gray-600 text-xs font-semibold ">WEBSITE</div>
          <div className="text-gray-800 text-base font-medium ">www.outschool.com</div>
        </div>
        <div className="w-[633px] h-[0px] border-[0.5px] border-gray-400"></div>
      </div>
      <div className="flex flex-row justify-between gap-2  w-fit h-fit">
        <div className="w-[98px] h-12 px-5 py-3 opacity-40 bg-indigo-700 rounded-lg justify-center items-center gap-2 inline-flex">
          <div className="text-white text-base font-medium font-['Inter'] leading-normal">Save</div>
        </div>
        <button
          className=" p-2 rounded-md bg-indigo-700 w-[98px] text-white text-base font-medium font-['Inter'] leading-normal "
          onClick={handleLogout}
        >
          log out
        </button>
      </div>
    </div>
  );
}
