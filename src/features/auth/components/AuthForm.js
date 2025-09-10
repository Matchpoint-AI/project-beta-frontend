var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import {
  signInWithEmailAndPassword,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { useAuthentication } from '../../firebase';
import { useState } from 'react';
import PropTypes from 'prop-types';
import posthog from '../../helpers/posthog';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { getServiceURL } from '../../helpers/getServiceURL';
import registerUser from '../../helpers/registerUser';
import { CircularProgress } from '@mui/material';
export default function AuthForm(_a) {
  var _this = this;
  var _b = _a.login,
    login = _b === void 0 ? false : _b,
    setAuthError = _a.setAuthError;
  var _c = useState(''),
    name = _c[0],
    setName = _c[1];
  var _d = useState(''),
    email = _d[0],
    setEmail = _d[1];
  var _e = useState(''),
    password = _e[0],
    setPassword = _e[1];
  var _f = useState(false),
    remember = _f[0],
    setRemember = _f[1];
  var auth = useAuthentication().auth;
  var signin = useAuth().login;
  var _g = useState(''),
    confirmPass = _g[0],
    setConfirmPass = _g[1];
  var _h = useState(false),
    error = _h[0],
    setError = _h[1];
  var _j = useState(false),
    loading = _j[0],
    setLoading = _j[1]; // Loading state
  // const navigate = useNavigate(); // Removed unused variable
  var cookies = new Cookies();
  var data_url = getServiceURL('data');
  var handleResendEmail = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var response, data, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(true);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, 5, 6]);
            return [
              4 /*yield*/,
              fetch(''.concat(data_url, '/api/v1/user/resend-verification'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
              }),
            ];
          case 2:
            response = _a.sent();
            return [4 /*yield*/, response.json()];
          case 3:
            data = _a.sent();
            if (!response.ok) {
              throw new Error(data.detail || 'Failed to resend verification email');
            }
            setAuthError('Verification email resent successfully!');
            return [3 /*break*/, 6];
          case 4:
            error_1 = _a.sent();
            setAuthError(error_1.message);
            return [3 /*break*/, 6];
          case 5:
            setLoading(false);
            return [7 /*endfinally*/];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  var handleSubmit = function (e) {
    return __awaiter(_this, void 0, void 0, function () {
      var res, id_token, response, profile, regRes, error_2, authError;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(true);
            e.preventDefault();
            if (!auth) return [2 /*return*/];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 17, , 18]);
            if (!remember) return [3 /*break*/, 3];
            return [4 /*yield*/, setPersistence(auth, browserLocalPersistence)];
          case 2:
            _a.sent();
            return [3 /*break*/, 5];
          case 3:
            return [4 /*yield*/, setPersistence(auth, browserSessionPersistence)];
          case 4:
            _a.sent();
            _a.label = 5;
          case 5:
            if (!login) return [3 /*break*/, 14];
            return [4 /*yield*/, signInWithEmailAndPassword(auth, email, password)];
          case 6:
            res = _a.sent();
            if (!!res.user.emailVerified) return [3 /*break*/, 8];
            return [4 /*yield*/, auth.signOut()];
          case 7:
            _a.sent();
            setLoading(false);
            setAuthError(
              _jsxs('span', {
                children: [
                  'please verify your email address before logging in. check your inbox for the verification email.',
                  _jsx('span', {
                    className: 'block underline text-purple-600 hover:cursor-pointer mt-2',
                    onClick: handleResendEmail,
                    children: 'Resend email',
                  }),
                ],
              })
            );
            return [2 /*return*/];
          case 8:
            return [4 /*yield*/, res.user.getIdToken()];
          case 9:
            id_token = _a.sent();
            return [
              4 /*yield*/,
              fetch(''.concat(data_url, '/api/v1/user'), {
                headers: {
                  Authorization: 'Bearer '.concat(id_token),
                },
              }),
            ];
          case 10:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to fetch user profile');
            }
            return [4 /*yield*/, response.json()];
          case 11:
            profile = _a.sent();
            if (!(!profile || profile.email !== res.user.email)) return [3 /*break*/, 13];
            return [4 /*yield*/, auth.signOut()];
          case 12:
            _a.sent();
            setLoading(false);
            setAuthError('Account not properly configured. Please contact support.');
            return [2 /*return*/];
          case 13:
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
            return [3 /*break*/, 16];
          case 14:
            cookies.set('email', email, {
              path: '/',
              maxAge: remember ? 30 * 24 * 60 * 60 : undefined,
            });
            cookies.set('name', name, {
              path: '/',
              maxAge: remember ? 30 * 24 * 60 * 60 : undefined,
            });
            return [4 /*yield*/, registerUser(email, name, password)];
          case 15:
            regRes = _a.sent();
            if (regRes.success) {
              setAuthError(
                regRes.message ||
                  'Registration successful. Please check your email for verification.'
              );
            }
            if (posthog.__loaded) {
              posthog.capture('User Signed Up', {
                email: email,
                name: name,
              });
            }
            _a.label = 16;
          case 16:
            setLoading(false);
            return [3 /*break*/, 18];
          case 17:
            error_2 = _a.sent();
            setLoading(false);
            if (login) {
              authError = error_2;
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
              if (error_2 === 'User already exists') {
                setAuthError('Email already exists.');
              } else {
                setAuthError('Sign up failed. Please retry.');
              }
            }
            return [3 /*break*/, 18];
          case 18:
            return [2 /*return*/];
        }
      });
    });
  };
  var handleConfirmPass = function () {
    if (password !== confirmPass) setError(true);
    else setError(false);
  };
  return _jsxs('form', {
    className: 'sm:px-10 px-3',
    onSubmit: handleSubmit,
    children: [
      _jsx('div', {
        className: 'mb-2 font-bold text-2xl',
        children: _jsx('h1', { children: login ? 'Login' : 'Sign Up' }),
      }),
      _jsx('div', {
        className: 'mb-5',
        children: _jsx('p', {
          className: 'text-sm text-gray-500',
          children: 'Get started with Matchpoint AI for free. Create content in minutes.',
        }),
      }),
      !login &&
        _jsxs('div', {
          className: 'mb-5',
          children: [
            _jsx('label', {
              htmlFor: 'name',
              className: 'block mb-2 text-sm font-medium text-gray-900',
              children: 'Name',
            }),
            _jsx('input', {
              type: 'text',
              id: 'name',
              className:
                'shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ',
              placeholder: 'John Doe',
              required: true,
              onChange: function (e) {
                return setName(e.target.value);
              },
            }),
          ],
        }),
      _jsxs('div', {
        className: 'mb-5',
        children: [
          _jsx('label', {
            htmlFor: 'email',
            className: 'block mb-2 text-sm font-medium text-gray-900 ',
            children: 'Email',
          }),
          _jsx('input', {
            type: 'email',
            id: 'email',
            className:
              'shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ',
            required: true,
            value: email,
            onChange: function (e) {
              return setEmail(e.target.value);
            },
          }),
        ],
      }),
      _jsxs('div', {
        className: 'mb-5',
        children: [
          _jsx('label', {
            htmlFor: 'password',
            className: 'block mb-2 text-sm font-medium text-gray-900 ',
            children: 'Password',
          }),
          _jsx('input', {
            type: 'password',
            id: 'password',
            className:
              'shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ',
            value: password,
            onChange: function (e) {
              return setPassword(e.target.value);
            },
            required: true,
          }),
        ],
      }),
      !login &&
        _jsxs('div', {
          className: 'mb-5',
          children: [
            _jsx('label', {
              htmlFor: 'repeat-password',
              className: 'block mb-2 text-sm font-medium text-gray-900 ',
              children: 'Confirm password',
            }),
            _jsx('input', {
              type: 'password',
              id: 'repeat-password',
              value: confirmPass,
              onChange: function (e) {
                return setConfirmPass(e.target.value);
              },
              className: 'shadow-sm '.concat(
                !error ? 'border-gray-300' : 'border-red-600',
                ' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
              ),
              required: true,
              onBlur: handleConfirmPass,
            }),
          ],
        }),
      _jsxs('div', {
        className: 'flex justify-between items-start mb-5',
        children: [
          login &&
            _jsx(Link, {
              to: '/auth/action?mode=resetPassword',
              className: 'capitalize text-sm font-medium text-blue-700 hover:underline',
              children: 'forgot password? reset it',
            }),
          _jsxs('div', {
            className: 'flex items-center',
            children: [
              _jsx('input', {
                id: 'terms',
                type: 'checkbox',
                value: '',
                className:
                  'w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800',
                // required
                onChange: function (e) {
                  return setRemember(e.target.checked);
                },
              }),
              _jsx('label', {
                htmlFor: 'terms',
                className: 'ms-2 text-sm font-medium text-gray-900',
                children: 'Remember me',
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'flex justify-end w-full flex-col sm:flex-row gap-2',
        children: _jsx('button', {
          type: 'submit',
          disabled: loading,
          className:
            'text-white bg-[#5145CD] hover:bg-[#6875F5] font-medium rounded-lg text-sm '.concat(
              loading ? 'px-5 py-[5.5px]' : 'px-5 py-2.5',
              ' text-center w-full'
            ),
          children: loading
            ? _jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 25, thickness: 5 })
            : login
              ? 'Login'
              : 'Sign Up',
        }),
      }),
      !login
        ? _jsxs('p', {
            className: 'text-sm text-gray-500 mt-2',
            children: [
              'Already have an account?',
              ' ',
              _jsx(Link, {
                to: '/login',
                className: 'font-medium text-blue-700 hover:underline',
                children: 'Log in',
              }),
            ],
          })
        : _jsxs('p', {
            className: 'text-sm text-gray-500 mt-2',
            children: [
              "Don't have an account?",
              ' ',
              _jsx(Link, {
                to: '/signup',
                type: 'button',
                className: 'font-medium text-blue-700 hover:underline',
                children: 'Sign Up',
              }),
            ],
          }),
    ],
  });
}
AuthForm.propTypes = {
  login: PropTypes.bool,
  setAuthError: PropTypes.func.isRequired,
};
//# sourceMappingURL=AuthForm.js.map
