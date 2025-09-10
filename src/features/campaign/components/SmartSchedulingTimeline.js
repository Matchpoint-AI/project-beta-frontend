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
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Paper,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  TrendingUp,
  Edit,
  Add,
  Analytics,
  SmartToy,
  Info,
} from '@mui/icons-material';
import { getPostingScheduleArray } from '../../../helpers/calculateTiming';
// Date utility functions to replace dayjs
var parseDate = function (dateStr) {
  // Handle MM/DD/YYYY format
  if (dateStr.includes('/')) {
    var _a = dateStr.split('/').map(Number),
      month = _a[0],
      day = _a[1],
      year = _a[2];
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
};
var formatDate = function (date, format) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  switch (format) {
    case 'YYYY-MM-DD':
      return date.toISOString().split('T')[0];
    case 'MMM D':
      return ''.concat(months[date.getMonth()], ' ').concat(date.getDate());
    case 'MM/DD/YYYY':
      return ''
        .concat((date.getMonth() + 1).toString().padStart(2, '0'), '/')
        .concat(date.getDate().toString().padStart(2, '0'), '/')
        .concat(date.getFullYear());
    default:
      return date.toISOString();
  }
};
var addTime = function (date, amount, unit) {
  var newDate = new Date(date);
  if (unit === 'week') {
    newDate.setDate(newDate.getDate() + amount * 7);
  } else if (unit === 'day') {
    newDate.setDate(newDate.getDate() + amount);
  }
  return newDate;
};
var subtractTime = function (date, amount, unit) {
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() - amount);
  return newDate;
};
var isBefore = function (date1, date2) {
  return date1.getTime() < date2.getTime();
};
var diffInDays = function (date1, date2) {
  return Math.floor((date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000));
};
var PLATFORM_COLORS = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  default: '#6B7280',
};
var STATUS_COLORS = {
  scheduled: '#3B82F6',
  completed: '#10B981',
  overdue: '#EF4444',
  in_progress: '#F59E0B',
};
var SmartSchedulingTimeline = function (_a) {
  var campaignId = _a.campaignId,
    startDate = _a.startDate,
    duration = _a.duration,
    postsPerWeek = _a.postsPerWeek,
    onScheduleChange = _a.onScheduleChange,
    _b = _a.readonly,
    readonly = _b === void 0 ? false : _b;
  var _c = useState([]),
    events = _c[0],
    setEvents = _c[1];
  var _d = useState(null),
    selectedEvent = _d[0],
    setSelectedEvent = _d[1];
  var _e = useState(false),
    editDialogOpen = _e[0],
    setEditDialogOpen = _e[1];
  var _f = useState(false),
    isLoading = _f[0],
    setIsLoading = _f[1];
  var _g = useState(null),
    aiInsights = _g[0],
    setAiInsights = _g[1];
  var _h = useState(false),
    showInsights = _h[0],
    setShowInsights = _h[1];
  // Generate optimal posting times using AI-like logic
  var generateOptimalSchedule = useCallback(
    function () {
      var schedule = [];
      var start = parseDate(startDate);
      var postingTimes = getPostingScheduleArray(postsPerWeek);
      // AI-optimized time slots based on engagement data
      var aiOptimizedTimes = [
        { time: '9:00 AM', engagement: 0.85, day: 'Monday' },
        { time: '12:00 PM', engagement: 0.92, day: 'Wednesday' },
        { time: '5:00 PM', engagement: 0.88, day: 'Friday' },
        { time: '8:00 PM', engagement: 0.95, day: 'Sunday' },
        { time: '2:00 PM', engagement: 0.78, day: 'Tuesday' },
      ];
      for (var week = 0; week < duration; week++) {
        var weekStart = addTime(start, week, 'week');
        for (var post = 0; post < postsPerWeek; post++) {
          var dayOffset = Math.floor(post * (7 / postsPerWeek));
          var postDate = addTime(weekStart, dayOffset, 'day');
          var aiTime = aiOptimizedTimes[post % aiOptimizedTimes.length];
          // Post event
          schedule.push({
            id: 'post-w'.concat(week, '-p').concat(post),
            title: 'Campaign Post '.concat(week * postsPerWeek + post + 1),
            type: 'post',
            date: formatDate(postDate, 'YYYY-MM-DD'),
            time: aiTime.time,
            status: isBefore(postDate, new Date()) ? 'completed' : 'scheduled',
            priority: post === 0 ? 'high' : 'medium',
            estimatedEngagement: Math.round(aiTime.engagement * 100),
            aiOptimized: true,
            platform: ['instagram', 'facebook', 'twitter'][post % 3],
            description: 'AI-optimized for '
              .concat(aiTime.engagement * 100, '% engagement on ')
              .concat(aiTime.day),
          });
          // Review event (2 days before post)
          var reviewDate = subtractTime(postDate, 2, 'day');
          if (!isBefore(reviewDate, new Date())) {
            schedule.push({
              id: 'review-w'.concat(week, '-p').concat(post),
              title: 'Review: Post '.concat(week * postsPerWeek + post + 1),
              type: 'review',
              date: formatDate(reviewDate, 'YYYY-MM-DD'),
              time: '10:00 AM',
              status: 'scheduled',
              priority: 'medium',
              aiOptimized: false,
              description: 'Content review and approval required',
            });
          }
        }
        // Weekly delivery milestone
        var deliveryDate = addTime(weekStart, 6, 'day');
        schedule.push({
          id: 'delivery-w'.concat(week),
          title: 'Week '.concat(week + 1, ' Delivery'),
          type: 'delivery',
          date: formatDate(deliveryDate, 'YYYY-MM-DD'),
          time: '5:00 PM',
          status: isBefore(deliveryDate, new Date()) ? 'completed' : 'scheduled',
          priority: 'high',
          aiOptimized: false,
          description: 'Deliver '.concat(postsPerWeek, ' posts for week ').concat(week + 1),
        });
      }
      return schedule.sort(function (a, b) {
        var dateA = new Date(''.concat(a.date, ' ').concat(a.time));
        var dateB = new Date(''.concat(b.date, ' ').concat(b.time));
        return dateA.getTime() - dateB.getTime();
      });
    },
    [startDate, duration, postsPerWeek]
  );
  // Generate AI insights
  var generateAiInsights = useCallback(
    function () {
      var bestTimes = ['9:00 AM Mon', '12:00 PM Wed', '5:00 PM Fri', '8:00 PM Sun'];
      var avgEngagement =
        events.reduce(function (acc, event) {
          return acc + (event.estimatedEngagement || 75);
        }, 0) / events.length;
      setAiInsights({
        bestTimes: bestTimes,
        engagementPrediction: Math.round(avgEngagement),
        optimization:
          avgEngagement > 85
            ? 'Excellent timing optimization'
            : avgEngagement > 70
              ? 'Good timing, consider shifting some posts to peak hours'
              : 'Timeline needs optimization for better engagement',
      });
    },
    [events]
  );
  useEffect(
    function () {
      if (startDate && duration && postsPerWeek) {
        setIsLoading(true);
        var schedule = generateOptimalSchedule();
        setEvents(schedule);
        onScheduleChange === null || onScheduleChange === void 0
          ? void 0
          : onScheduleChange(schedule);
        setIsLoading(false);
      }
    },
    [startDate, duration, postsPerWeek, generateOptimalSchedule, onScheduleChange]
  );
  useEffect(
    function () {
      if (events.length > 0) {
        generateAiInsights();
      }
    },
    [events, generateAiInsights]
  );
  var handleEventClick = function (event) {
    if (!readonly) {
      setSelectedEvent(event);
      setEditDialogOpen(true);
    }
  };
  var handleEventUpdate = function (updatedEvent) {
    var updatedEvents = events.map(function (event) {
      return event.id === updatedEvent.id ? updatedEvent : event;
    });
    setEvents(updatedEvents);
    onScheduleChange === null || onScheduleChange === void 0
      ? void 0
      : onScheduleChange(updatedEvents);
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };
  var getEventIcon = function (type) {
    switch (type) {
      case 'post':
        return _jsx(Schedule, {});
      case 'review':
        return _jsx(Edit, {});
      case 'approval':
        return _jsx(TrendingUp, {});
      case 'delivery':
        return _jsx(CalendarToday, {});
      default:
        return _jsx(Schedule, {});
    }
  };
  var weeklyGroups = useMemo(
    function () {
      var groups = {};
      events.forEach(function (event) {
        var eventDate = new Date(event.date);
        var weekStart = parseDate(startDate);
        var weekNumber = Math.floor(diffInDays(eventDate, weekStart) / 7) + 1;
        var weekKey = 'Week '.concat(weekNumber);
        if (!groups[weekKey]) {
          groups[weekKey] = [];
        }
        groups[weekKey].push(event);
      });
      return groups;
    },
    [events, startDate]
  );
  var completionRate = useMemo(
    function () {
      var completedEvents = events.filter(function (e) {
        return e.status === 'completed';
      }).length;
      return events.length > 0 ? (completedEvents / events.length) * 100 : 0;
    },
    [events]
  );
  if (isLoading) {
    return _jsx(Card, {
      children: _jsxs(CardContent, {
        children: [
          _jsx(Typography, {
            variant: 'h6',
            gutterBottom: true,
            children: 'Generating Smart Schedule...',
          }),
          _jsx(LinearProgress, {}),
        ],
      }),
    });
  }
  return _jsxs(Box, {
    children: [
      _jsx(Card, {
        sx: { mb: 3 },
        children: _jsxs(CardContent, {
          children: [
            _jsxs(Box, {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              children: [
                _jsxs(Typography, {
                  variant: 'h5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  children: [_jsx(SmartToy, { color: 'primary' }), 'Smart Scheduling Timeline'],
                }),
                _jsxs(Box, {
                  display: 'flex',
                  gap: 1,
                  children: [
                    _jsx(Tooltip, {
                      title: 'View AI insights',
                      children: _jsx(IconButton, {
                        onClick: function () {
                          return setShowInsights(true);
                        },
                        children: _jsx(Analytics, {}),
                      }),
                    }),
                    !readonly &&
                      _jsx(Tooltip, {
                        title: 'Add custom event',
                        children: _jsx(IconButton, {
                          onClick: function () {
                            /* Add event logic */
                          },
                          children: _jsx(Add, {}),
                        }),
                      }),
                  ],
                }),
              ],
            }),
            _jsxs(Box, {
              display: 'flex',
              gap: 3,
              mb: 2,
              children: [
                _jsxs(Box, {
                  children: [
                    _jsx(Typography, {
                      variant: 'body2',
                      color: 'textSecondary',
                      children: 'Campaign Progress',
                    }),
                    _jsxs(Typography, {
                      variant: 'h6',
                      children: [Math.round(completionRate), '%'],
                    }),
                  ],
                }),
                _jsxs(Box, {
                  children: [
                    _jsx(Typography, {
                      variant: 'body2',
                      color: 'textSecondary',
                      children: 'Total Events',
                    }),
                    _jsx(Typography, { variant: 'h6', children: events.length }),
                  ],
                }),
                _jsxs(Box, {
                  children: [
                    _jsx(Typography, {
                      variant: 'body2',
                      color: 'textSecondary',
                      children: 'Avg. Predicted Engagement',
                    }),
                    _jsxs(Typography, {
                      variant: 'h6',
                      children: [
                        (aiInsights === null || aiInsights === void 0
                          ? void 0
                          : aiInsights.engagementPrediction) || '--',
                        '%',
                      ],
                    }),
                  ],
                }),
              ],
            }),
            _jsx(LinearProgress, {
              variant: 'determinate',
              value: completionRate,
              sx: { height: 8, borderRadius: 4 },
            }),
          ],
        }),
      }),
      _jsx(Grid, {
        container: true,
        spacing: 2,
        children: Object.entries(weeklyGroups).map(function (_a) {
          var weekName = _a[0],
            weekEvents = _a[1];
          return _jsx(
            Grid,
            {
              item: true,
              xs: 12,
              children: _jsxs(Paper, {
                sx: { p: 2 },
                children: [
                  _jsx(Typography, { variant: 'h6', gutterBottom: true, children: weekName }),
                  _jsx(Grid, {
                    container: true,
                    spacing: 1,
                    children: weekEvents.map(function (event) {
                      return _jsx(
                        Grid,
                        {
                          item: true,
                          xs: 12,
                          sm: 6,
                          md: 4,
                          children: _jsx(Card, {
                            sx: {
                              cursor: readonly ? 'default' : 'pointer',
                              borderLeft: '4px solid '.concat(STATUS_COLORS[event.status]),
                              '&:hover': readonly
                                ? {}
                                : {
                                    boxShadow: 2,
                                    transform: 'translateY(-1px)',
                                  },
                              transition: 'all 0.2s ease-in-out',
                            },
                            onClick: function () {
                              return handleEventClick(event);
                            },
                            children: _jsxs(CardContent, {
                              sx: { p: 2 },
                              children: [
                                _jsxs(Box, {
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  mb: 1,
                                  children: [
                                    _jsxs(Box, {
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      children: [
                                        getEventIcon(event.type),
                                        _jsx(Typography, {
                                          variant: 'subtitle2',
                                          noWrap: true,
                                          children: event.title,
                                        }),
                                      ],
                                    }),
                                    event.aiOptimized &&
                                      _jsx(Tooltip, {
                                        title: 'AI Optimized',
                                        children: _jsx(SmartToy, {
                                          fontSize: 'small',
                                          color: 'primary',
                                        }),
                                      }),
                                  ],
                                }),
                                _jsxs(Typography, {
                                  variant: 'body2',
                                  color: 'textSecondary',
                                  gutterBottom: true,
                                  children: [
                                    formatDate(new Date(event.date), 'MMM D'),
                                    ' at ',
                                    event.time,
                                  ],
                                }),
                                _jsxs(Box, {
                                  display: 'flex',
                                  gap: 1,
                                  mb: 1,
                                  flexWrap: 'wrap',
                                  children: [
                                    _jsx(Chip, {
                                      size: 'small',
                                      label: event.status,
                                      sx: {
                                        backgroundColor: STATUS_COLORS[event.status],
                                        color: 'white',
                                      },
                                    }),
                                    _jsx(Chip, {
                                      size: 'small',
                                      label: event.priority,
                                      variant: 'outlined',
                                    }),
                                    event.platform &&
                                      _jsx(Chip, {
                                        size: 'small',
                                        label: event.platform,
                                        sx: {
                                          backgroundColor:
                                            PLATFORM_COLORS[event.platform] ||
                                            PLATFORM_COLORS.default,
                                          color: 'white',
                                        },
                                      }),
                                  ],
                                }),
                                event.estimatedEngagement &&
                                  _jsxs(Box, {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    children: [
                                      _jsx(TrendingUp, { fontSize: 'small' }),
                                      _jsxs(Typography, {
                                        variant: 'caption',
                                        children: [
                                          event.estimatedEngagement,
                                          '% predicted engagement',
                                        ],
                                      }),
                                    ],
                                  }),
                                event.description &&
                                  _jsx(Typography, {
                                    variant: 'caption',
                                    color: 'textSecondary',
                                    display: 'block',
                                    mt: 1,
                                    children: event.description,
                                  }),
                              ],
                            }),
                          }),
                        },
                        event.id
                      );
                    }),
                  }),
                ],
              }),
            },
            weekName
          );
        }),
      }),
      _jsxs(Dialog, {
        open: showInsights,
        onClose: function () {
          return setShowInsights(false);
        },
        maxWidth: 'md',
        fullWidth: true,
        children: [
          _jsx(DialogTitle, {
            children: _jsxs(Box, {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              children: [_jsx(Analytics, {}), 'AI Scheduling Insights'],
            }),
          }),
          _jsx(DialogContent, {
            children:
              aiInsights &&
              _jsxs(Grid, {
                container: true,
                spacing: 2,
                children: [
                  _jsx(Grid, {
                    item: true,
                    xs: 12,
                    children: _jsx(Alert, {
                      severity: 'info',
                      icon: _jsx(Info, {}),
                      children: aiInsights.optimization,
                    }),
                  }),
                  _jsxs(Grid, {
                    item: true,
                    xs: 12,
                    md: 6,
                    children: [
                      _jsx(Typography, {
                        variant: 'h6',
                        gutterBottom: true,
                        children: 'Optimal Posting Times',
                      }),
                      _jsx(Box, {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        children: aiInsights.bestTimes.map(function (time, index) {
                          return _jsx(Chip, { label: time, variant: 'outlined' }, index);
                        }),
                      }),
                    ],
                  }),
                  _jsxs(Grid, {
                    item: true,
                    xs: 12,
                    md: 6,
                    children: [
                      _jsx(Typography, {
                        variant: 'h6',
                        gutterBottom: true,
                        children: 'Performance Predictions',
                      }),
                      _jsxs(Typography, {
                        variant: 'body2',
                        gutterBottom: true,
                        children: ['Average Engagement: ', aiInsights.engagementPrediction, '%'],
                      }),
                      _jsxs(Typography, {
                        variant: 'body2',
                        children: [
                          'Timeline Optimization Score:',
                          ' ',
                          aiInsights.engagementPrediction > 85
                            ? 'Excellent'
                            : aiInsights.engagementPrediction > 70
                              ? 'Good'
                              : 'Needs Improvement',
                        ],
                      }),
                    ],
                  }),
                ],
              }),
          }),
          _jsx(DialogActions, {
            children: _jsx(Button, {
              onClick: function () {
                return setShowInsights(false);
              },
              children: 'Close',
            }),
          }),
        ],
      }),
      _jsxs(Dialog, {
        open: editDialogOpen,
        onClose: function () {
          return setEditDialogOpen(false);
        },
        maxWidth: 'sm',
        fullWidth: true,
        children: [
          _jsx(DialogTitle, { children: 'Edit Event' }),
          _jsx(DialogContent, {
            children:
              selectedEvent &&
              _jsxs(Grid, {
                container: true,
                spacing: 2,
                sx: { mt: 1 },
                children: [
                  _jsx(Grid, {
                    item: true,
                    xs: 12,
                    children: _jsx(TextField, {
                      fullWidth: true,
                      label: 'Title',
                      value: selectedEvent.title,
                      onChange: function (e) {
                        return setSelectedEvent(
                          __assign(__assign({}, selectedEvent), { title: e.target.value })
                        );
                      },
                    }),
                  }),
                  _jsx(Grid, {
                    item: true,
                    xs: 6,
                    children: _jsx(TextField, {
                      fullWidth: true,
                      type: 'date',
                      label: 'Date',
                      value: selectedEvent.date,
                      onChange: function (e) {
                        return setSelectedEvent(
                          __assign(__assign({}, selectedEvent), { date: e.target.value })
                        );
                      },
                      InputLabelProps: { shrink: true },
                    }),
                  }),
                  _jsx(Grid, {
                    item: true,
                    xs: 6,
                    children: _jsx(TextField, {
                      fullWidth: true,
                      type: 'time',
                      label: 'Time',
                      value: selectedEvent.time,
                      onChange: function (e) {
                        return setSelectedEvent(
                          __assign(__assign({}, selectedEvent), { time: e.target.value })
                        );
                      },
                      InputLabelProps: { shrink: true },
                    }),
                  }),
                  _jsx(Grid, {
                    item: true,
                    xs: 6,
                    children: _jsxs(FormControl, {
                      fullWidth: true,
                      children: [
                        _jsx(InputLabel, { children: 'Status' }),
                        _jsxs(Select, {
                          value: selectedEvent.status,
                          onChange: function (e) {
                            return setSelectedEvent(
                              __assign(__assign({}, selectedEvent), { status: e.target.value })
                            );
                          },
                          children: [
                            _jsx(MenuItem, { value: 'scheduled', children: 'Scheduled' }),
                            _jsx(MenuItem, { value: 'in_progress', children: 'In Progress' }),
                            _jsx(MenuItem, { value: 'completed', children: 'Completed' }),
                            _jsx(MenuItem, { value: 'overdue', children: 'Overdue' }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  _jsx(Grid, {
                    item: true,
                    xs: 6,
                    children: _jsxs(FormControl, {
                      fullWidth: true,
                      children: [
                        _jsx(InputLabel, { children: 'Priority' }),
                        _jsxs(Select, {
                          value: selectedEvent.priority,
                          onChange: function (e) {
                            return setSelectedEvent(
                              __assign(__assign({}, selectedEvent), { priority: e.target.value })
                            );
                          },
                          children: [
                            _jsx(MenuItem, { value: 'high', children: 'High' }),
                            _jsx(MenuItem, { value: 'medium', children: 'Medium' }),
                            _jsx(MenuItem, { value: 'low', children: 'Low' }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  _jsx(Grid, {
                    item: true,
                    xs: 12,
                    children: _jsx(TextField, {
                      fullWidth: true,
                      multiline: true,
                      rows: 3,
                      label: 'Description',
                      value: selectedEvent.description || '',
                      onChange: function (e) {
                        return setSelectedEvent(
                          __assign(__assign({}, selectedEvent), { description: e.target.value })
                        );
                      },
                    }),
                  }),
                ],
              }),
          }),
          _jsxs(DialogActions, {
            children: [
              _jsx(Button, {
                onClick: function () {
                  return setEditDialogOpen(false);
                },
                children: 'Cancel',
              }),
              _jsx(Button, {
                onClick: function () {
                  return selectedEvent && handleEventUpdate(selectedEvent);
                },
                variant: 'contained',
                children: 'Save Changes',
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default SmartSchedulingTimeline;
//# sourceMappingURL=SmartSchedulingTimeline.js.map
