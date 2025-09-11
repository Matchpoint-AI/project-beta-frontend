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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import ContentOverlay from './ContentOverlay';
import Pagination from './Pagination';
// import SocialMediaPost from "./SocialMediaPost";
import { getServiceURL } from '../../../helpers/getServiceURL';
import SkeletonSocialMediaPost from './SkeletonSocialMediaPost';
// import { CampaignContext } from "../../../context/CampaignContext";
import { structureData } from '../../../helpers/formatters';
// import { getPostingScheduleArray } from "../../../helpers/calculateTiming";
// import moment from "moment-timezone";
// import { CircularProgress } from "@mui/material";
import DayBanner from './DayBanner';
var ContentLibrary = function (_a) {
  var _b;
  var campaign = _a.campaign,
    setStats = _a.setStats;
  var _c = useState(1),
    currentPage = _c[0],
    setCurrentPage = _c[1];
  var _d = React.useState(0),
    open = _d[0],
    setOpen = _d[1];
  var _e = useState(0),
    totalPages = _e[0],
    setTotalPages = _e[1];
  var _f = useState(''),
    brandName = _f[0],
    setBrandName = _f[1];
  var _g = useState(''),
    startDate = _g[0],
    setStartDate = _g[1];
  var _h = useState([]),
    weeksContent = _h[0],
    setWeeksContent = _h[1];
  var _j = useState(''),
    text = _j[0],
    setText = _j[1];
  var _k = useState(''),
    generatedContentId = _k[0],
    setGeneratedContentId = _k[1];
  var _l = useState(true),
    loading = _l[0],
    setLoading = _l[1]; // Add a loading state
  var profile = useAuth().profile;
  var id = useParams().id;
  var endpointUrl = getServiceURL('content-gen');
  useEffect(
    function () {
      if (campaign === undefined) return;
      setTotalPages(campaign.campaign_data.campaign_variables.durationNum);
      setBrandName(campaign.campaign_data.biz_variables.brand_name);
      setStartDate(campaign.campaign_data.campaign_variables.start_date);
    },
    [campaign]
  );
  var updataImage = function (week, day, post, imageIndex, newImage, newText) {
    if (!newImage && newText) {
      setWeeksContent(function (old) {
        var arr = Array.from(old);
        arr[week][day].posts[post].text = newText;
        return arr;
      });
    } else {
      setWeeksContent(function (old) {
        var _a;
        var arr = Array.from(old);
        (_a = arr[week][day]['posts'][post]['image_url']) === null || _a === void 0
          ? void 0
          : _a.push(newImage);
        arr[week][day].posts[post].selected_image = newImage;
        arr[week][day].posts[post].text = newText;
        return arr;
      });
    }
  };
  useEffect(
    function () {
      if (
        (profile === null || profile === void 0 ? void 0 : profile.token) === '' ||
        id === undefined
      )
        return;
      var params = new URLSearchParams({
        campaign_id: id,
      });
      var pollingInterval = null;
      var fetchSingleWeek = function () {
        return __awaiter(void 0, void 0, void 0, function () {
          var response, data, newData_1, isFullyGenerated, _error_1;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 3, , 4]);
                return [
                  4 /*yield*/,
                  fetch(endpointUrl + '/api/v1/get-content?'.concat(params.toString()), {
                    method: 'GET',
                    headers: {
                      Authorization: 'Bearer '.concat(
                        profile === null || profile === void 0 ? void 0 : profile.token
                      ),
                      'Content-Type': 'application/json',
                    },
                  }),
                ];
              case 1:
                response = _a.sent();
                if (!response.ok) {
                  return [2 /*return*/];
                }
                return [4 /*yield*/, response.json()];
              case 2:
                data = _a.sent();
                if (data.length === 0 || data.arr[0].length === 0) {
                  setText('Content Is Being Generated');
                  if (pollingInterval) clearInterval(pollingInterval);
                  setLoading(false);
                  return [2 /*return*/];
                }
                newData_1 = structureData(data === null || data === void 0 ? void 0 : data.arr);
                setGeneratedContentId(data === null || data === void 0 ? void 0 : data.id);
                setWeeksContent(function (prevContent) {
                  if (!prevContent.length) return newData_1; // Initial fetch, set directly
                  // Merge new data with existing content
                  var updatedContent = prevContent.map(function (week, weekIndex) {
                    return week.map(function (day, dayIndex) {
                      return __assign(__assign({}, day), {
                        posts:
                          day === null || day === void 0
                            ? void 0
                            : day.posts.map(function (post, postIndex) {
                                var _a, _b;
                                return post.image_url // Keep existing post if it has image_url
                                  ? post
                                  : ((_b =
                                      (_a = newData_1[weekIndex]) === null || _a === void 0
                                        ? void 0
                                        : _a[dayIndex]) === null || _b === void 0
                                      ? void 0
                                      : _b.posts[postIndex]) || post;
                              }),
                      });
                    });
                  });
                  return updatedContent;
                });
                isFullyGenerated = newData_1.every(function (week) {
                  return week.every(function (day) {
                    return day.posts.every(function (post) {
                      return post.image_url;
                    });
                  });
                });
                if (isFullyGenerated) {
                  if (pollingInterval) clearInterval(pollingInterval);
                }
                setLoading(false);
                return [3 /*break*/, 4];
              case 3:
                _error_1 = _a.sent();
                setLoading(false);
                return [3 /*break*/, 4];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      };
      fetchSingleWeek();
      // Start polling every 10 seconds
      pollingInterval = setInterval(fetchSingleWeek, 10000);
      // Cleanup interval on unmount
      return function () {
        if (pollingInterval) clearInterval(pollingInterval);
      };
    },
    [profile === null || profile === void 0 ? void 0 : profile.token, id]
  );
  var handleApprovalUpdate = function (weekIndex, dayIndex, postIndex, isApproved) {
    setTimeout(function () {
      setWeeksContent(function (prevContent) {
        var _a;
        var updatedContent = __spreadArray([], prevContent, true);
        if (postIndex === null) {
          // Approve all posts in the specified day
          var dayPosts =
            (_a = updatedContent[weekIndex][dayIndex]) === null || _a === void 0
              ? void 0
              : _a.posts;
          // Count how many are currently unapproved
          var unapprovedCount_1 = dayPosts.filter(function (p) {
            return !p.approved;
          }).length;
          updatedContent[weekIndex][dayIndex].posts = updatedContent[weekIndex][dayIndex].posts.map(
            function (post) {
              return __assign(__assign({}, post), { approved: isApproved });
            }
          );
          updatedContent[weekIndex][dayIndex].approved = isApproved;
          setStats(function (prevStats) {
            return __assign(__assign({}, prevStats), {
              approved: prevStats.approved + unapprovedCount_1,
              ready_for_review: prevStats.ready_for_review - unapprovedCount_1,
            });
          });
        } else {
          // Approve only the specified post
          if (isApproved === false) {
            updatedContent[weekIndex][dayIndex].approved = isApproved;
          }
          updatedContent[weekIndex][dayIndex].posts[postIndex].approved = isApproved;
          if (isApproved === true) {
            setStats(function (prevStats) {
              return __assign(__assign({}, prevStats), {
                approved: prevStats.approved + 1,
                ready_for_review: prevStats.ready_for_review - 1,
              });
            });
          } else {
            setStats(function (prevStats) {
              return __assign(__assign({}, prevStats), {
                approved: prevStats.approved - 1,
                ready_for_review: prevStats.ready_for_review + 1,
              });
            });
          }
        }
        return updatedContent;
      });
    }, 0);
  };
  return _jsxs('div', {
    className: 'flex flex-col gap-4 mb-16',
    children: [
      open !== 0 &&
        _jsx(ContentOverlay, {
          day: open,
          closeOverlay: function () {
            return setOpen(0);
          },
          content: weeksContent[currentPage - 1][open - 1].posts,
          brandName: brandName,
          id: generatedContentId,
          week: currentPage,
          approved: weeksContent[currentPage - 1][open - 1].approved,
          setOpen: setOpen,
          updataImage: updataImage,
          onApprovalUpdate: function () {
            return handleApprovalUpdate(currentPage - 1, open - 1, null, true);
          },
        }),
      _jsx(Pagination, {
        totalPages: totalPages,
        currentPage: currentPage,
        onPageChange: function (val) {
          setCurrentPage(val);
        },
        prefixText: 'Week ',
      }),
      _jsxs('div', {
        className: 'flex flex-col items-center gap-4',
        children: [
          loading
            ? // Render 4 skeletons as placeholders
              Array.from({ length: 7 }).map(function (_, index) {
                return _jsx(SkeletonSocialMediaPost, {}, index);
              })
            : weeksContent.length > 0 &&
              weeksContent[currentPage - 1] &&
              ((_b = weeksContent[currentPage - 1]) === null || _b === void 0
                ? void 0
                : _b.map(function (val, index) {
                    return _jsx(
                      DayBanner,
                      {
                        brandName: brandName,
                        content: val,
                        currentPage: currentPage,
                        generatedContentId: generatedContentId,
                        handleApprovalUpdate: handleApprovalUpdate,
                        index: index,
                        setOpen: setOpen,
                        startDate: startDate,
                        updataImage: updataImage,
                      },
                      index
                    );
                  })),
          weeksContent.length === 0 && !loading && _jsx('p', { className: '', children: text }),
        ],
      }),
    ],
  });
};
export default ContentLibrary;
//# sourceMappingURL=ContentLibrary.js.map
