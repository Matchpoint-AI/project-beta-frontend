import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import React from 'react';

const navigation = [
  { name: 'Profile', href: '/profile' },
  { name: 'Social Account Connections', href: '/profile/integrations' },
];

export default function SettingsLayout() {
  return (
    <>
      <Sidebar />
      <main className="flex flex-col px-8 pt-28 md:pt-12 md:pl-28 bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF] ">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <header className="pl-4 ">
          <nav className="flex overflow-x-auto py-4 ">
            <ul
              role="list"
              className="
                flex min-w-full 
                flex-none 
                gap-x-6 
                text-sm font-semibold 
                leading-6 text-gray-600
                "
            >
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }: any) => (isActive ? 'text-indigo-600' : '')}
                    end
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <Outlet />
      </main>
    </>
  );
}
