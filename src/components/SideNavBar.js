import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CampaignContext } from '../context/CampaignContext';
import { signOut } from 'firebase/auth';
import { useAuthentication } from '../firebase';
import { TbLogout2 } from 'react-icons/tb';
import { TbBriefcase } from 'react-icons/tb';
import { TbPhoto } from 'react-icons/tb';
import { PiUsersBold } from 'react-icons/pi';
import { TbSparkles } from 'react-icons/tb';
import Cookies from 'universal-cookie';
import { useAuth } from '../features/auth/context/AuthContext';
import posthog from '../helpers/posthog';
import handleNavigate from '../helpers/handleNavigate';
export default function SideNavBar(_a) {
  var className = _a.className,
    phone = _a.phone,
    style = _a.style;
  var _b = useState(null),
    hoveredItem = _b[0],
    setHoveredItem = _b[1];
  var setCampaignInfo = useContext(CampaignContext).setCampaignInfo;
  var profile = useAuth().profile;
  var navigate = useNavigate();
  var auth = useAuthentication().auth;
  var pathname = useLocation().pathname;
  var cookies = new Cookies();
  var handleNewCampaign = function () {
    setCampaignInfo({
      currentStep: 1,
    });
    handleNavigate(profile.id, '/campaign', navigate);
  };
  var handleLogout = function () {
    var currentPath = window.location.pathname;
    signOut(auth)
      .then(function () {
        cookies.remove('access_token', {
          domain: window.location.hostname,
        });
        if (posthog.__loaded) {
          posthog.capture('User Logged Out', {
            distinct_id: profile.id,
          });
        }
        navigate('/login');
      })
      .catch(function (err) {});
  };
  // Tooltip component
  var Tooltip = function (_a) {
    var label = _a.label,
      show = _a.show;
    if (!show) return null;
    return _jsxs('div', {
      className: 'absolute left-[105%] ml-3 top-1/2 transform -translate-y-1/2',
      children: [
        _jsx('div', {
          className: 'absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full',
          children: _jsx('div', {
            className:
              'w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-white',
          }),
        }),
        ' ',
        _jsx('div', {
          className:
            'bg-white  px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm text-indigo-800 font-bold border border-gray-200',
          children: label,
        }),
      ],
    });
  };
  return _jsxs('nav', {
    className: 'flex flex-col justify-between items-center h-screen  py-5  '.concat(className),
    style: style,
    children: [
      !phone &&
        _jsx(Link, {
          to: '/',
          children: _jsx('img', { src: '/logo_simple.svg', alt: 'logo', width: 40, height: 40 }),
        }),
      _jsxs('div', {
        className: 'flex flex-col gap-10 flex-1 relative  w-full justify-center items-center',
        children: [
          _jsxs('div', {
            className: 'relative w-full flex justify-center items-center',
            onMouseEnter: function () {
              return setHoveredItem('add');
            },
            onMouseLeave: function () {
              return setHoveredItem(null);
            },
            children: [
              _jsx('img', {
                onClick: handleNewCampaign,
                src: '/add_button.svg',
                alt: 'add',
                width: 25,
                height: 25,
                className: 'hover:cursor-pointer',
              }),
              _jsx(Tooltip, { label: 'New Campaign', show: hoveredItem === 'add' }),
            ],
          }),
          _jsxs('div', {
            className: 'relative w-full flex justify-center items-center',
            onMouseEnter: function () {
              return setHoveredItem('dashboard');
            },
            onMouseLeave: function () {
              return setHoveredItem(null);
            },
            children: [
              _jsx('button', {
                className: '',
                type: 'button',
                onClick: function () {
                  return handleNavigate(profile.id, '/dashboard', navigate);
                },
                children: _jsx(Link, {
                  to: '/dashboard',
                  children: _jsx(TbPhoto, {
                    size: 30,
                    color:
                      pathname === '/' ||
                      pathname === '/dashboard' ||
                      pathname.includes('/campaign/content')
                        ? '#5145CD'
                        : '#111928',
                  }),
                }),
              }),
              _jsx(Tooltip, { label: 'Dashboard', show: hoveredItem === 'dashboard' }),
            ],
          }),
          _jsxs('div', {
            className: 'relative w-full flex justify-center items-center',
            onMouseEnter: function () {
              return setHoveredItem('onboard');
            },
            onMouseLeave: function () {
              return setHoveredItem(null);
            },
            children: [
              _jsx('button', {
                type: 'button',
                onClick: function () {
                  return handleNavigate(profile.id, '/onboard', navigate);
                },
                children: _jsx(Link, {
                  to: '/onboard',
                  children: _jsx(TbBriefcase, {
                    size: 30,
                    color: pathname === '/onboard' ? '#5145CD' : '#111928',
                  }),
                }),
              }),
              _jsx(Tooltip, { label: 'Business Onboarding', show: hoveredItem === 'onboard' }),
            ],
          }),
          profile &&
            profile.role === 'ADMIN' &&
            _jsxs(_Fragment, {
              children: [
                _jsxs('div', {
                  className: 'relative w-full flex justify-center items-center',
                  onMouseEnter: function () {
                    return setHoveredItem('prompts');
                  },
                  onMouseLeave: function () {
                    return setHoveredItem(null);
                  },
                  children: [
                    _jsx(Link, {
                      to: '/admin/prompts',
                      children: _jsx(TbSparkles, {
                        size: 30,
                        color: pathname === '/admin/prompts' ? '#5145CD' : '#111928',
                      }),
                    }),
                    _jsx(Tooltip, { label: 'Admin Prompts', show: hoveredItem === 'prompts' }),
                  ],
                }),
                _jsxs('div', {
                  className: 'relative w-full flex justify-center items-center',
                  onMouseEnter: function () {
                    return setHoveredItem('users');
                  },
                  onMouseLeave: function () {
                    return setHoveredItem(null);
                  },
                  children: [
                    _jsx(Link, {
                      to: '/admin/users',
                      children: _jsx(PiUsersBold, {
                        size: 30,
                        color: pathname.includes('/admin/users') ? '#5145CD' : '#111928',
                      }),
                    }),
                    _jsx(Tooltip, { label: 'Manage Users', show: hoveredItem === 'users' }),
                  ],
                }),
              ],
            }),
        ],
      }),
      _jsxs('div', {
        className: 'relative w-full flex justify-center items-center mb-4',
        onMouseEnter: function () {
          return setHoveredItem('logout');
        },
        onMouseLeave: function () {
          return setHoveredItem(null);
        },
        children: [
          _jsx('button', {
            onClick: handleLogout,
            children: _jsx(TbLogout2, { size: 30, color: 'black' }),
          }),
          _jsx(Tooltip, { label: 'Logout', show: hoveredItem === 'logout' }),
        ],
      }),
      _jsxs('div', {
        className: 'relative w-full flex justify-center items-center',
        onMouseEnter: function () {
          return setHoveredItem('profile');
        },
        onMouseLeave: function () {
          return setHoveredItem(null);
        },
        children: [
          _jsx(Link, {
            to: '/profile',
            children: _jsx('img', { src: '/profile.svg', alt: 'profile', width: 35, height: 35 }),
          }),
          _jsx(Tooltip, { label: 'Profile', show: hoveredItem === 'profile' }),
        ],
      }),
    ],
  });
}
//# sourceMappingURL=SideNavBar.js.map
