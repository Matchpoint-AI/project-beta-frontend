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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { BsTrash2 } from 'react-icons/bs';
import { PiInstagramLogo, PiPlug } from 'react-icons/pi';
import useIntegrationApi, {
  authenticateApp,
  getAppUser,
  revokeAuthApp,
} from '../../../api/api-integrations';
import { useEffect, useState } from 'react';
import useAppContext from '../../../context/appContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useAuth } from '../../../features/auth/context/AuthContext';
var PLATFORMS = ['INSTAGRAM'];
export default function Integrations() {
  var data = useAppContext().integrations.data;
  var profile = useAuth().profile;
  var _a = useState(false),
    isConnected = _a[0],
    setIsConnected = _a[1];
  useEffect(
    function () {
      if ((profile === null || profile === void 0 ? void 0 : profile.token) === '') return;
      var endpointUrl = getServiceURL('data');
      var redirectURI = ''.concat(endpointUrl, '/api/v1/instagram/callback');
      var baseurl =
        window.location.hostname === 'www.matchpointai.com'
          ? 'matchpointai.com'
          : window.location.hostname;
      fetch(''.concat(endpointUrl, '/api/v1/integrations/save_redirect_uri'), {
        method: 'POST',
        headers: {
          Authorization: 'Bearer '.concat(
            profile === null || profile === void 0 ? void 0 : profile.token
          ),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: redirectURI,
          base_url: baseurl,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data); // {"response": "all good"}
        })
        .catch(function (error) {
          return console.error('Error:', error);
        });
    },
    [profile]
  );
  useEffect(
    function () {
      if (data && data.length) {
        setIsConnected(true);
      }
    },
    [data]
  );
  return _jsxs('div', {
    className: 'flex-1 pt-4',
    children: [
      _jsx('h2', {
        className: 'pl-4 text-sm text-gray-700',
        children: 'Select and connect platforms to integrate with your workflow',
      }),
      _jsx('div', {
        className: 'p-8',
        children: _jsx('ul', {
          role: 'list',
          className: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
          children:
            isConnected || (data && data.length)
              ? _jsx(Connected, {
                  onRevoke: function () {
                    return setIsConnected(false);
                  },
                })
              : PLATFORMS.map(function (platform) {
                  return _jsx(
                    Unconnected,
                    {
                      onConnect: function () {
                        return setIsConnected(true);
                      },
                    },
                    platform
                  );
                }),
        }),
      }),
    ],
  });
}
var openAuthPopup = function (url, windowName) {
  if (windowName === void 0) {
    windowName = 'auth-popup';
  }
  return new Promise(function (resolve, reject) {
    var popup = window.open(url, windowName, 'width=600,height=700,left=200,top=200');
    if (!popup) {
      reject(new Error('Failed to open authentication popup'));
      return;
    }
    var timer = setInterval(function () {
      try {
        if (!popup || popup.closed) {
          clearInterval(timer);
          reject(new Error('Authentication popup closed by user'));
        }
        // Check if the popup redirected to the expected callback
        if (popup.location.href.includes('/profile/integrations')) {
          clearInterval(timer);
          // const params = new URLSearchParams(popup.location.search);
          // const token = params.get("token");
          popup.close();
          resolve('hello');
        }
      } catch (err) {
        // Ignore cross-origin errors
      }
    }, 1000);
  });
};
function Unconnected(_a) {
  var _this = this;
  var onConnect = _a.onConnect;
  var _b = useIntegrationApi(authenticateApp('instagram'), 'TRIGGER'),
    data = _b.data,
    requestURL = _b.triggerRequest;
  useEffect(
    function () {
      if (data && data.auth_url) {
        handleAuthPopup(data.auth_url);
      }
    },
    [data]
  );
  var handleAuthPopup = function (authUrl) {
    return __awaiter(_this, void 0, void 0, function () {
      var token, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [4 /*yield*/, openAuthPopup(authUrl)];
          case 1:
            token = _a.sent();
            if (token) {
              console.log('Authentication Successful, Token:', token);
              onConnect();
              // Save token or trigger next steps
            }
            return [3 /*break*/, 3];
          case 2:
            err_1 = _a.sent();
            console.error('Authentication failed:', err_1.message);
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  return _jsxs('li', {
    className: 'col-span-1 divide-y divide-gray-200 rounded-md bg-white border drop-shadow-sm',
    children: [
      _jsxs('div', {
        className: 'flex flex-col items-center gap-3 p-6 ',
        children: [
          _jsx(PiInstagramLogo, { size: 40 }),
          _jsx('h3', { className: 'text-sm font-semibold text-gray-600 ', children: 'Instagram' }),
        ],
      }),
      _jsxs('div', {
        className:
          '\n          flex items-center justify-center gap-4 \n          py-4 divide-gray-200 text-green-700\n          hover:cursor-pointer\n          ',
        onClick: requestURL,
        children: [
          _jsx(PiPlug, { size: 15 }),
          _jsx('button', { className: 'text-sm font-semibold', children: 'Connect' }),
        ],
      }),
    ],
  });
}
function Connected(_a) {
  var onRevoke = _a.onRevoke;
  var _b = useAppContext().integrations,
    refetch = _b.triggerRequest,
    refetchLoading = _b.loading;
  var _c = useIntegrationApi(revokeAuthApp('instagram'), 'TRIGGER'),
    requestRevoke = _c.triggerRequest,
    revokeLoading = _c.loading;
  var handleRevoke = function () {
    requestRevoke().then(function () {
      refetch();
      onRevoke();
    });
  };
  var data = useIntegrationApi(getAppUser('instagram')).data;
  // FIX: refactor the loading state
  return _jsxs('li', {
    className:
      'flex flex-col justify-between col-span-1 divide-y bg-white divide-gray-200 rounded-md  border drop-shadow-sm',
    children: [
      _jsx('div', {
        className: 'flex w-full h-full items-center justify-between p-6',
        children: !data
          ? _jsxs(_Fragment, {
              children: [
                _jsx('div', {
                  className: 'flex-1 truncate animate-pulse',
                  children: _jsx('div', { className: 'h-5 bg-gray-200 rounded w-1/3' }),
                }),
                _jsx('div', {
                  className: 'h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 animate-pulse',
                }),
              ],
            })
          : _jsxs(_Fragment, {
              children: [
                _jsx('div', {
                  className: 'flex-1 truncate',
                  children: _jsx('h3', {
                    className: 'truncate text-sm font-bold text-gray-900',
                    children: data.username,
                  }),
                }),
                _jsx('img', {
                  className: 'h-10 w-10 flex-shrink-0 rounded-full bg-gray-300',
                  src: 'https://ui-avatars.com/api/?name='.concat(data.username),
                }),
              ],
            }),
      }),
      _jsxs('div', {
        className:
          '\n          flex items-center justify-center gap-4 \n          py-4 divide-gray-200 text-red-500 \n          hover:cursor-pointer',
        onClick: handleRevoke,
        children: [
          _jsx(BsTrash2, { size: 15 }),
          _jsx('button', {
            className: 'text-sm font-semibold disabled:cursor-not-allowed',
            disabled: revokeLoading || refetchLoading,
            children: 'Remove',
          }),
        ],
      }),
    ],
  });
}
//# sourceMappingURL=integrations.js.map
