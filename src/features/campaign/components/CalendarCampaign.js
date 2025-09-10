var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
import { jsx as _jsx } from 'react/jsx-runtime';
// Calendar.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CampaignToolBar from './CampaignToolBar';
import MonthHeader from './MonthHeader';
import EventWrapper from './EventWrapper';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useParams } from 'react-router-dom';
import { getServiceURL } from '../../../helpers/getServiceURL';
var DateCell = function (props) {
  var parseData = function () {
    var val = parseInt(props.label, 10).toString();
    return val;
  };
  return _jsx('div', {
    className: 'font-medium text-base border-1 w-fit h-fit border-gray-200 float-end',
    children: parseData(),
  });
};
var CalendarCampaign = function (_a) {
  var campaign = _a.campaign;
  var localizer = useMemo(function () {
    return momentLocalizer(moment);
  }, []);
  var calendarRef = useRef(null);
  var profile = useAuth().profile;
  var id = useParams().id;
  var _b = useState([]),
    events = _b[0],
    setEvents = _b[1];
  var components = useMemo(function () {
    return {
      eventWrapper: EventWrapper, // wrapper for the event component
      toolbar: CampaignToolBar,
      month: {
        header: MonthHeader,
        dateHeader: DateCell,
        // event: EventWrapper,
      },
    };
  }, []);
  var endpointUrl = getServiceURL('data');
  useEffect(
    function () {
      if ((profile === null || profile === void 0 ? void 0 : profile.token) === '') return;
      var params = new URLSearchParams({
        query_kind: 'generated_content',
        id: id,
        week: '1',
      });
      var createEvents = function (weekDataArray) {
        var dateString = campaign.campaign_data.campaign_variables.start_date;
        var _a = dateString.split('/'),
          month = _a[0],
          day = _a[1],
          year = _a[2];
        var startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        // Define time slots mapping based on number of posts
        var timeSlotsMapping = {
          1: ['9 AM'],
          2: ['9 AM', '12 PM'],
          3: ['9 AM', '2 PM', '5 PM'],
          4: ['9 AM', '12 PM', '2 PM', '5 PM'],
        };
        // Initialize an empty array to store all events
        var allEvents = [];
        // Loop through each weekData in the array
        weekDataArray.forEach(function (weekData) {
          var eventsForWeek = Array.from({ length: 7 }, function (_, index) {
            var currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + index);
            var dayKey = 'day_'.concat(index + 1);
            var dayData = weekData[dayKey];
            console.log('dayData === ', dayData);
            var status = '';
            if (dayData.approved) status = 'approved';
            else if (!dayData.approved && dayData.posts_to_generate === 0) status = 'review';
            else if (!dayData.approved && dayData.posts_to_generate > 0) status = 'generate';
            // Get all keys that start with "post_"
            var postKeys = Object.keys(dayData).filter(function (key) {
              return key.startsWith('post_');
            });
            // Sort keys numerically (e.g., "post_1", "post_2", ...)
            postKeys.sort(function (a, b) {
              var numA = parseInt(a.split('_')[1], 10);
              var numB = parseInt(b.split('_')[1], 10);
              return numA - numB;
            });
            var numberOfPosts = postKeys.length;
            var timeSlots = timeSlotsMapping[numberOfPosts];
            if (!timeSlots) {
              timeSlots = timeSlotsMapping[4] || ['9 AM', '12 PM', '2 PM', '5 PM'];
            }
            // Build the posts array for this day
            var postsForDay = postKeys.map(function (key, i) {
              return __assign(__assign({}, dayData[key]), {
                timing: timeSlots[i] || timeSlots[timeSlots.length - 1],
              });
            });
            return {
              title: 'Day '.concat(index + 1),
              start: currentDay,
              end: currentDay,
              status: status,
              posts: postsForDay,
            };
          });
          // Combine events for the current week with the overall array
          allEvents.push.apply(allEvents, eventsForWeek);
        });
        // Return all events combined
        return allEvents;
      };
      var fetchContentGenerated = function () {
        return __awaiter(void 0, void 0, void 0, function () {
          var response, data, eventsArr, error_1;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 3, , 4]);
                return [
                  4 /*yield*/,
                  fetch(endpointUrl + '/api/v1/data/get/complex?'.concat(params.toString()), {
                    method: 'GET',
                    headers: {
                      Authorization: 'Bearer '.concat(
                        profile === null || profile === void 0 ? void 0 : profile.token
                      ),
                    },
                  }),
                ];
              case 1:
                response = _a.sent();
                if (!response.ok) {
                  throw new Error('Failed to fetch data');
                }
                return [4 /*yield*/, response.json()];
              case 2:
                data = _a.sent();
                console.log('data:', data);
                if (data.length === 0 || data.arr[0].length === 0) {
                  // navigate("/dashboard");
                  return [2 /*return*/];
                }
                console.log('newData1 === ', data.arr[0]);
                eventsArr = createEvents(data.arr[0]);
                setEvents(eventsArr);
                return [3 /*break*/, 4];
              case 3:
                error_1 = _a.sent();
                console.error('Error fetching data:', error_1);
                return [3 /*break*/, 4];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      };
      fetchContentGenerated();
    },
    [profile]
  );
  return _jsx('div', {
    className: 'h-screen mt-5 mb-5 py-0 text-gray-900',
    children: _jsx(Calendar, {
      className: 'border-none',
      ref: calendarRef,
      culture: 'en-US',
      localizer: localizer,
      events: events,
      components: components,
      views: ['month'],
      defaultView: 'month',
    }),
  });
};
export default CalendarCampaign;
//# sourceMappingURL=CalendarCampaign.js.map
