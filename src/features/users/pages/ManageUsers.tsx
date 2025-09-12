import React from 'react';
import Sidebar from '../../../shared/components/layout/Sidebar';
import UsersTable from '../components/UsersTable';

export default function ManageUsers() {
  return (
    <div className="w-full h-full">
      <div className="flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF] overflow-y-auto">
        <Sidebar />
        <div className="md:ml-[80px] flex-grow flex flex-col gap-8 p-8 md:mt-8 mt-[80px]">
          <h1 className=" font-semibold text-[30px] text-[#5145CD] capitalize">Users</h1>
          <UsersTable />
        </div>
      </div>
    </div>
  );
}
