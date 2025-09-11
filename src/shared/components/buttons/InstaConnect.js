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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useAuth } from '../../../features/auth/context/AuthContext';
import useAppContext from '../../../context/appContext';
import useIntegrationApi, {
  authenticateApp,
  getAvailableIntegrations,
  revokeAuthApp,
} from '../../../api/api-integrations';
import { Box, CircularProgress, Modal } from '@mui/material';
import InstagramIcon from '../../InstagramIcon';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import ErrorToast from '../ErrorToast';
import { SparklesMessage } from '../SparklesMessage';
import { FaCheckCircle } from 'react-icons/fa';
import { GoClock } from 'react-icons/go';
import { VscHome } from 'react-icons/vsc';
import { MdCalendarToday, MdClose, MdOutlineUpdate } from 'react-icons/md';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FaRegCalendarDays } from 'react-icons/fa6';
var PLATFORMS = ['INSTAGRAM'];
var InstaConnect = function (_a) {
  var _b = _a.publish,
    publish = _b === void 0 ? false : _b,
    stats = _a.stats,
    startDate = _a.startDate,
    duration = _a.duration;
  var integrations = useIntegrationApi(getAvailableIntegrations());
  var data = integrations.data;
  var profile = useAuth().profile;
  var _c = useState(false),
    isConnected = _c[0],
    setIsConnected = _c[1];
  var _d = useState(null),
    error = _d[0],
    setError = _d[1];
  useEffect(
    function () {
      if (!profile || !profile.token) {
        setError('Authentication required');
        return;
      }
      var endpointUrl = getServiceURL('data');
      var redirectURI = ''.concat(endpointUrl, '/api/v1/instagram/callback');
      var baseurl =
        window.location.hostname === 'www.matchpointai.com'
          ? 'matchpointai.com'
          : window.location.hostname;
      fetch(''.concat(endpointUrl, '/api/v1/integrations/save_redirect_uri'), {
        method: 'POST',
        headers: {
          Authorization: 'Bearer '.concat(profile.token),
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
        .then(function (_data) {})
        .catch(function (error) {
          console.error('Error:', error);
          setError('Failed to save redirect URI');
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
  if (error) {
    return _jsx('div', { className: 'text-red-500', children: error });
  }
  return _jsx(_Fragment, {
    children:
      isConnected || (data && data.length)
        ? publish
          ? _jsx(PublishApproved, { stats: stats, startDate: startDate, duration: duration })
          : _jsx(Connected, {
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
                publish: publish,
              },
              platform
            );
          }),
  });
};
function EndPublishPopup(_a) {
  var isPopupOpen = _a.isPopupOpen,
    setIsPopupOpen = _a.setIsPopupOpen,
    stats = _a.stats,
    onNavigateToDashboard = _a.onNavigateToDashboard;
  if (!isPopupOpen) return null;
  var handleClose = function () {
    setIsPopupOpen(false);
  };
  var handleNavigateToDashboard = function () {
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
    setIsPopupOpen(false);
  };
  return _jsx('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
    onClick: handleClose,
    children: _jsxs('div', {
      className: 'relative w-full max-w-2xl rounded-lg bg-white shadow-lg',
      children: [
        _jsx('button', {
          className: 'absolute right-4 top-4 text-gray-500 hover:text-gray-700',
          onClick: handleClose,
          'aria-label': 'Close',
          children: _jsx(MdClose, { className: 'h-5 w-5' }),
        }),
        _jsxs('div', {
          className: 'px-6 py-8 flex flex-col justify-center items-center text-center',
          children: [
            _jsx('div', {
              className: 'mb-4',
              children: _jsx(FaCheckCircle, { className: 'w-9 h-9 text-[#0E9F6E]' }),
            }),
            _jsxs('h2', {
              className:
                'text-3xl font-semibold leading-[45px] text-transparent bg-clip-text bg-gradient-to-r from-[#681DBA] to-[#FF43E1] mb-4',
              children: [
                'Your ',
                (stats === null || stats === void 0 ? void 0 : stats.approved) || 0,
                ' Posts Are Scheduled!',
              ],
            }),
            (stats === null || stats === void 0 ? void 0 : stats.ready_for_review)
              ? _jsxs('p', {
                  className: 'text-[#374151] font-medium text-lg mb-6',
                  children: [
                    'For optimal campaign results, we suggest scheduling your remaining',
                    ' ',
                    stats.ready_for_review,
                    ' posts',
                  ],
                })
              : null,
            _jsxs('div', {
              className: 'flex flex-col md:flex-row justify-center gap-4 w-full max-w-md',
              children: [
                (stats === null || stats === void 0 ? void 0 : stats.ready_for_review)
                  ? _jsxs('button', {
                      className:
                        'bg-[#FDF6B2] hover:bg-[#faef91] font-bold text-base flex flex-row rounded-lg justify-center items-center gap-2 px-5 py-3 text-[#8E4B10] transition-colors',
                      onClick: handleClose,
                      children: [
                        _jsx(GoClock, { className: 'w-5 h-5' }),
                        'Schedule Remaining Posts',
                      ],
                    })
                  : null,
                _jsxs('button', {
                  onClick: handleNavigateToDashboard,
                  className:
                    'border-[1px] border-[#6B7280] bg-[#F9FAFB] hover:bg-[#deecfa] font-bold text-base flex flex-row rounded-lg justify-center items-center gap-2 px-5 py-3 text-[#630CC3] transition-colors',
                  children: [_jsx(VscHome, { className: 'w-5 h-5' }), 'Return to Dashboard'],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
var DateSelector = function (_a) {
  var label = _a.label,
    date = _a.date,
    onDateChange = _a.onDateChange,
    minDate = _a.minDate,
    maxDate = _a.maxDate;
  return _jsxs(Box, {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 0,
      p: 2,
    },
    children: [
      _jsx('p', { className: 'text-[#5145CD] font-normal text-sm', children: label }),
      _jsx(DatePicker, {
        value: date,
        onChange: onDateChange,
        minDate: minDate,
        maxDate: maxDate,
        className: 'w-full',
        format: 'MMMM D, YYYY',
        slots: {
          openPickerIcon: FaRegCalendarDays,
        },
        slotProps: {
          textField: {
            variant: 'standard',
            InputProps: {
              disableUnderline: true,
              sx: {
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                color: '#630CC3',
              },
            },
          },
          openPickerButton: {
            sx: {
              position: 'absolute',
              right: 24,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'grey.400',
            },
          },
        },
      }),
    ],
  });
};
var ConfirmDate = function (_a) {
  var isPopupOpen = _a.isPopupOpen,
    setIsPopupOpen = _a.setIsPopupOpen,
    stats = _a.stats,
    onClick = _a.onClick,
    loading = _a.loading,
    start_date = _a.start_date,
    duration = _a.duration;
  var _b = useState(dayjs(start_date)),
    startDate = _b[0],
    setStartDate = _b[1]; // Use dayjs for correct format
  var _c = useState(dayjs(start_date).add(duration, 'week')),
    endDate = _c[0],
    setEndDate = _c[1];
  useEffect(
    function () {
      // 1) Figure out if local time is past 9 AM
      var now = dayjs();
      var isPast9AM = now.hour() >= 9; // e.g. 9 means 9:00 AM
      // 2) If it's past 9 AM, clamp earliest start to tomorrow (same time next day)
      // otherwise, clamp earliest start to "today" (just a dayjs() date with current time).
      var earliestAllowedStart = isPast9AM ? now.add(1, 'day').startOf('day') : now.startOf('day');
      if (start_date !== '') {
        var initialStartFromProps = dayjs(start_date); // just an example
        // 1) If initialStartFromProps is in the past relative to today,
        //    clamp it so that we start from today instead.
        var actualInitialStart = initialStartFromProps.isBefore(earliestAllowedStart, 'day')
          ? earliestAllowedStart
          : initialStartFromProps;
        setStartDate(actualInitialStart);
        setEndDate(actualInitialStart.add(duration, 'week'));
      }
    },
    [isPopupOpen, start_date, duration]
  );
  // Handle start date changes
  var handleStartDateChange = function (newStart) {
    if (!newStart) return;
    setStartDate(newStart);
    // Automatically recalc the end date based on the new start date
    var newMinimumEnd = newStart.add(duration, 'week');
    // If the current end date is before newMinimumEnd, clamp it
    if (endDate.isBefore(newMinimumEnd)) {
      setEndDate(newMinimumEnd);
    }
  };
  // Handle end date changes
  var handleEndDateChange = function (newEnd) {
    if (!newEnd) return;
    // The earliest allowed end date is startDate + duration
    var minAllowedEnd = startDate.add(duration, 'week');
    if (newEnd.isBefore(minAllowedEnd)) {
      // Either clamp it automatically:
      setEndDate(minAllowedEnd);
      // OR just ignore the change or show an error/snackbar if you prefer:
      // e.g., alert("End date can't be earlier than start date + duration!");
    } else {
      setEndDate(newEnd);
    }
  };
  return _jsx(LocalizationProvider, {
    dateAdapter: AdapterDayjs,
    children: _jsx(Modal, {
      onClose: function () {
        return setIsPopupOpen(false);
      },
      open: isPopupOpen,
      className: '',
      children: _jsx(Box, {
        style: {
          outline: 'none',
        },
        className:
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 flex flex-col justify-center items-center bg-white rounded-xl shadow-xl  w-[90%] h-fit lg:w-[600px] lg:h-[400px] xl:w-[750px] xl:h-[466px] border-[1px] border-[#E5E7EB] text-center',
        children: _jsxs('div', {
          className: 'w-full h-fit flex flex-col justify-center items-center gap-3',
          children: [
            _jsx('div', {
              style: { color: '#6C2BD9', width: 36, height: 36 },
              children: _jsx(MdCalendarToday, {}),
            }),
            _jsx('h2', {
              className:
                'text-3xl font-semibold leading-[45px] text-transparent bg-clip-text bg-gradient-to-r from-[#681DBA] to-[#FF43E1]',
              children: 'Please confirm campaign dates',
            }),
            _jsxs('div', {
              className:
                'flex w-full flex-col justify-center gap-4 mt-2 border-[1px] border-[#E5E7EB] rounded-lg p-4',
              children: [
                _jsx(DateSelector, {
                  label: 'Start Date',
                  date: startDate,
                  onDateChange: handleStartDateChange,
                  minDate: startDate,
                }),
                _jsx(DateSelector, {
                  label: 'End Date',
                  date: endDate,
                  onDateChange: handleEndDateChange,
                  minDate: startDate.add(duration, 'week'),
                }),
              ],
            }),
            _jsx('button', {
              onClick: function () {
                return onClick(startDate);
              },
              disabled: loading,
              className: ''.concat(
                loading ? 'cursor-not-allowed bg-[#82FFC9]' : 'bg-[#82FFC9] hover:bg-[#6dfabd]',
                '  font-bold text-base flex flex-row rounded-lg justify-center items-center gap-2 px-5 py-3 text-[#046C4E]'
              ),
              children: loading
                ? _jsx(CircularProgress, { sx: { color: '#046C4E' }, size: 25, thickness: 5 })
                : _jsxs(_Fragment, {
                    children: [
                      _jsx('img', { src: '/publish.svg', className: 'w-4 h-4 text-[#046C4E]' }),
                      _jsxs('h3', {
                        className: 'text-base font-bold text-[#046C4E]',
                        children: [
                          'Confirm & Publish ',
                          stats.approved,
                          ' of ',
                          stats.total_content,
                        ],
                      }),
                    ],
                  }),
            }),
          ],
        }),
      }),
    }),
  });
};
var PublishApproved = function (_a) {
  var stats = _a.stats,
    startDate = _a.startDate,
    duration = _a.duration;
  var _b = useState(false),
    loading = _b[0],
    setLoading = _b[1];
  var _c = useState(false),
    isPopupOpen = _c[0],
    setIsPopupOpen = _c[1];
  var _d = useState(false),
    isDateOpen = _d[0],
    setDateOpen = _d[1];
  var _e = useState(false),
    published = _e[0],
    setPublished = _e[1];
  var endpointUrl = getServiceURL('content-gen');
  var profile = useAuth().profile;
  var id = useParams().id;
  var _f = useState(false),
    status = _f[0],
    setStatus = _f[1];
  var _g = useState(false),
    isOpen = _g[0],
    setIsOpen = _g[1];
  var _h = useState(''),
    message = _h[0],
    setMessage = _h[1];
  var validateTimezone = function (timezone) {
    return moment.tz.zone(timezone) !== null;
  };
  var navigate = useNavigate();
  var updatePostingDate = function (startDate) {
    return __awaiter(void 0, void 0, void 0, function () {
      var endpointUrl_1, formattedDate, response, errorData, data, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 5, , 6]);
            endpointUrl_1 = getServiceURL('content-gen');
            formattedDate = dayjs(startDate).format('M/D/YYYY');
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl_1, '/api/v1/campaign/updatePostingDate'), {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  campaign_id: id,
                  // timezone: userTimezone,
                  postingDate: formattedDate, // The new property you want to store
                }),
              }),
            ];
          case 1:
            response = _a.sent();
            if (response.ok) return [3 /*break*/, 3];
            return [4 /*yield*/, response.json()];
          case 2:
            errorData = _a.sent();
            throw new Error(errorData.detail || 'Failed to update postingDate');
          case 3:
            return [4 /*yield*/, response.json()];
          case 4:
            data = _a.sent();
            return [2 /*return*/, data];
          case 5:
            error_1 = _a.sent();
            console.error('Error updating postingDate:', error_1);
            throw error_1; // re-throw to let handlePublish catch it
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  useEffect(
    function () {
      var checkPublishedStatus = function () {
        return __awaiter(void 0, void 0, void 0, function () {
          var response, data, error_2;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 4, , 5]);
                return [
                  4 /*yield*/,
                  fetch(
                    ''
                      .concat(endpointUrl, '/api/v1/contentgen/get-publish-status?campaign_id=')
                      .concat(id),
                    {
                      headers: {
                        Authorization: 'Bearer '.concat(
                          profile === null || profile === void 0 ? void 0 : profile.token
                        ),
                      },
                    }
                  ),
                ];
              case 1:
                response = _a.sent();
                if (!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
              case 2:
                data = _a.sent();
                setPublished(data.published || false);
                _a.label = 3;
              case 3:
                return [3 /*break*/, 5];
              case 4:
                error_2 = _a.sent();
                console.error('Error checking publish status:', error_2);
                return [3 /*break*/, 5];
              case 5:
                return [2 /*return*/];
            }
          });
        });
      };
      if (id && (profile === null || profile === void 0 ? void 0 : profile.token)) {
        checkPublishedStatus();
      }
    },
    [id, profile === null || profile === void 0 ? void 0 : profile.token]
  );
  var handlePublish = function (newStartDate) {
    return __awaiter(void 0, void 0, void 0, function () {
      var userTimezone, validTimezone, response, result, error_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            validTimezone = validateTimezone(userTimezone) ? userTimezone : 'UTC';
            setLoading(true);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 8, 9, 10]);
            return [4 /*yield*/, updatePostingDate(newStartDate)];
          case 2:
            _a.sent();
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/campaign/publish'), {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  campaign_id: id,
                  timezone: validTimezone,
                }),
              }),
            ];
          case 3:
            response = _a.sent();
            return [4 /*yield*/, response.json()];
          case 4:
            result = _a.sent();
            if (!response.ok) return [3 /*break*/, 6];
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/contentgen/update-publish-status'), {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  campaign_id: id,
                  published: true,
                }),
              }).then(function (res) {
                return __awaiter(void 0, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2 /*return*/, res.ok ? setPublished(true) : null];
                  });
                });
              }),
            ];
          case 5:
            _a.sent();
            setStatus(true);
            if (result.message) {
              setMessage(result.message);
            } else {
              setMessage('Approved Posts have been published');
            }
            setIsOpen(true);
            return [3 /*break*/, 7];
          case 6:
            setStatus(false);
            setMessage('Something Went Wrong! Try again Later');
            setIsOpen(true);
            _a.label = 7;
          case 7:
            return [3 /*break*/, 10];
          case 8:
            error_3 = _a.sent();
            console.error('Error:', error_3);
            return [3 /*break*/, 10];
          case 9:
            setLoading(false);
            setDateOpen(false);
            setIsPopupOpen(true);
            return [7 /*endfinally*/];
          case 10:
            return [2 /*return*/];
        }
      });
    });
  };
  var checkApproved = function () {
    // 1) Destructure stats if you like:
    var _a = stats.total_content,
      total_content = _a === void 0 ? 0 : _a,
      _b = stats.approved,
      approved = _b === void 0 ? 0 : _b,
      _c = stats.published,
      published = _c === void 0 ? 0 : _c;
    // 2) Check if all content is approved or published
    if (approved + published !== total_content) {
      // Not all content is approved/published, block the user
      setMessage('Please approve all content before proceeding.');
      setStatus(false); // false = show error style
      setIsOpen(true); // show the Snackbar
      return;
    }
    setDateOpen(true);
  };
  return _jsxs(_Fragment, {
    children: [
      published
        ? _jsxs('button', {
            onClick: function () {
              return setDateOpen(true);
            },
            className:
              'flex relative flex-row w-fit items-center gap-2 rounded-lg px-5 py-3 bg-[#82FFC9] hover:bg-[#59fab4]',
            children: [
              _jsx(MdOutlineUpdate, {}),
              _jsx('h3', {
                className: 'text-base font-bold text-green-700',
                children: 'Update Scheduled Posts',
              }),
              _jsx('div', {
                className:
                  'absolute -top-3 -right-2 text-center w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#046C4E]',
                children: _jsx('span', {
                  className: 'text-[#82FFC9] text-base font-bold',
                  children: stats.approved,
                }),
              }),
            ],
          })
        : _jsxs('button', {
            onClick: checkApproved,
            className:
              'flex relative flex-row w-fit items-center gap-2 rounded-lg px-5 py-3 bg-[#82FFC9] hover:bg-[#59fab4]',
            children: [
              _jsx('img', { src: '/publish.svg', className: 'w-4 h-4' }),
              _jsx('h3', {
                className: 'text-base font-bold text-green-700',
                children: 'Publish Approved Posts',
              }),
              _jsx('div', {
                className:
                  'absolute -top-3 -right-2 text-center w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#046C4E]',
                children: _jsx('span', {
                  className: 'text-[#82FFC9] text-base font-bold',
                  children: stats.approved,
                }),
              }),
            ],
          }),
      _jsx(EndPublishPopup, {
        isPopupOpen: isPopupOpen,
        setIsPopupOpen: setIsPopupOpen,
        stats: stats,
        onNavigateToDashboard: function () {
          return navigate('/dashboard');
        },
      }),
      _jsx(ConfirmDate, {
        isPopupOpen: isDateOpen,
        setIsPopupOpen: setDateOpen,
        stats: stats,
        onClick: handlePublish,
        loading: loading,
        start_date: startDate,
        duration: duration,
      }),
      !status
        ? _jsx(ErrorToast, {
            message: message,
            open: isOpen,
            success: status,
            onClose: function () {
              return setIsOpen(false);
            },
          })
        : null,
    ],
  });
};
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
      onRevoke(); // Inform parent that the integration was revoked
    });
  };
  // const { data } = useIntegrationApi(getAppUser("instagram"));
  // FIX: refactor the loading state
  return _jsxs(_Fragment, {
    children: [
      _jsxs('button', {
        onClick: handleRevoke,
        disabled: revokeLoading || refetchLoading,
        className: 'mt-5 mb-3 flex flex-row w-fit items-center gap-2 rounded-lg px-5 py-4 '.concat(
          revokeLoading || refetchLoading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-indigo-700 hover:bg-[#6875F5]'
        ),
        children: [
          _jsx(InstagramIcon, {}),
          revokeLoading || refetchLoading
            ? _jsxs(_Fragment, {
                children: [
                  _jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 25, thickness: 5 }),
                  _jsx('h3', {
                    className: 'text-sm font-semibold text-white',
                    children: 'Revoking...',
                  }),
                ],
              })
            : _jsx('h3', { className: 'text-sm font-semibold text-white', children: 'Connected' }),
        ],
      }),
      _jsx(SparklesMessage, {
        children:
          'Once your campaign content is ready, you can post it directly to Instagram or Facebook',
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
        if (popup.location.href.includes('/profile/integrations')) {
          clearInterval(timer);
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
  var onConnect = _a.onConnect,
    publish = _a.publish;
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
              onConnect(); // Inform parent component that authentication succeeded
            }
            return [3 /*break*/, 3];
          case 2:
            err_1 = _a.sent();
            console.error(
              'Authentication failed:',
              err_1 === null || err_1 === void 0 ? void 0 : err_1.message
            );
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  return _jsxs(_Fragment, {
    children: [
      _jsxs('div', {
        onClick: requestURL,
        className: 'mt-5  '
          .concat(publish ? '' : 'mb-3', ' flex flex-row w-fit items-center gap-2 rounded-lg ')
          .concat(
            publish ? 'px-3 py-[9px]' : 'px-5 py-4',
            ' hover:cursor-pointer bg-indigo-700 hover:bg-[#6875F5]'
          ),
        children: [
          _jsx(InstagramIcon, {}),
          _jsx('h3', {
            className: 'text-sm font-semibold text-white',
            children: 'Connect with Meta',
          }),
        ],
      }),
      publish === false &&
        _jsx(SparklesMessage, {
          children:
            'Once your campaign content is ready, you can post it directly to Instagram or Facebook',
        }),
    ],
  });
}
export default InstaConnect;
//# sourceMappingURL=InstaConnect.js.map
