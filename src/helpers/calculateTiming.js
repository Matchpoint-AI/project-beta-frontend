var calculateWeekNumber = function (startDate, durationWeeks) {
  var now = new Date();
  var endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + durationWeeks * 7);
  // Calculate the difference in milliseconds
  var daysBetween = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  // Calculate the week number
  return Math.ceil(daysBetween / 7);
};
var formatMonthDayYear = function (date) {
  var options = {
    // month: "short",
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};
var formatMonth = function (date) {
  var options = {
    month: 'short',
  };
  return date.toLocaleDateString('en-US', options);
};
var formatFullDate = function (date) {
  var options = { year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
export var displayPeriod = function (startDate, duration) {
  var _a;
  if (!startDate || startDate === '') return 'Timing not selected';
  if (!duration || duration === '') return 'Timing not selected';
  try {
    var _b = startDate.split('/').map(Number),
      month = _b[0],
      day = _b[1],
      year = _b[2];
    var start = new Date(year, month - 1, day);
    // Parse the duration
    var durationParts = duration.split(' ');
    if (durationParts.length < 2) {
      // If duration is just a number, assume weeks
      var durationValue_1 = Number(duration);
      if (isNaN(durationValue_1)) return 'Timing not selected';
      var end_1 = new Date(start);
      end_1.setDate(start.getDate() + durationValue_1 * 7);
      var now_1 = new Date();
      var isCompleted_1 = now_1 >= end_1;
      var weekNumber_1 = isCompleted_1
        ? durationValue_1
        : calculateWeekNumber(start, durationValue_1);
      var startMonth_1 = formatMonth(start);
      var startDayMonth_1 = formatMonthDayYear(start);
      var endDayMonth_1 = formatMonthDayYear(end_1);
      var startYear_1 = formatFullDate(start);
      var endYear_1 = formatFullDate(end_1);
      var dateRange_1;
      if (startYear_1 === endYear_1) {
        if (start.getMonth() === end_1.getMonth()) {
          dateRange_1 = ''
            .concat(startMonth_1, ' ')
            .concat(startDayMonth_1, ' - ')
            .concat(endDayMonth_1, ', ')
            .concat(startYear_1);
        } else {
          dateRange_1 = ''
            .concat(startMonth_1, ' ')
            .concat(startDayMonth_1, ' - ')
            .concat(endDayMonth_1, ', ')
            .concat(startYear_1);
        }
      } else {
        dateRange_1 = ''
          .concat(startMonth_1, ' ')
          .concat(startDayMonth_1, ', ')
          .concat(startYear_1, ' - ')
          .concat(endDayMonth_1, ', ')
          .concat(endYear_1);
      }
      if (isCompleted_1 || weekNumber_1 <= 0) {
        return ''.concat(durationValue_1, ' weeks, ').concat(dateRange_1);
      } else {
        return 'Week '
          .concat(weekNumber_1, ' of ')
          .concat(durationValue_1, ', ')
          .concat(dateRange_1);
      }
    }
    var durationValue = Number(durationParts[0]);
    var durationUnit =
      ((_a = durationParts[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'weeks';
    if (isNaN(durationValue)) return 'Timing not selected';
    // Calculate the end date
    var end = void 0;
    if (durationUnit === 'weeks' || durationUnit === 'week') {
      end = new Date(start);
      end.setDate(start.getDate() + durationValue * 7);
    } else {
      throw new Error('Unsupported duration unit: '.concat(durationUnit));
    }
    var now = new Date();
    var isCompleted = now >= end;
    var weekNumber = isCompleted ? durationValue : calculateWeekNumber(start, durationValue);
    var startMonth = formatMonth(start);
    var startDayMonth = formatMonthDayYear(start);
    var endDayMonth = formatMonthDayYear(end);
    var startYear = formatFullDate(start);
    var endYear = formatFullDate(end);
    var dateRange = void 0;
    if (startYear === endYear) {
      if (start.getMonth() === end.getMonth()) {
        dateRange = ''
          .concat(startMonth, ' ')
          .concat(startDayMonth, ' - ')
          .concat(endDayMonth, ', ')
          .concat(startYear);
      } else {
        dateRange = ''
          .concat(startMonth, ' ')
          .concat(startDayMonth, ' - ')
          .concat(endDayMonth, ', ')
          .concat(startYear);
      }
    } else {
      dateRange = ''
        .concat(startMonth, ' ')
        .concat(startDayMonth, ', ')
        .concat(startYear, ' - ')
        .concat(endDayMonth, ', ')
        .concat(endYear);
    }
    if (isCompleted || weekNumber <= 0) {
      return ''.concat(duration, ', ').concat(dateRange);
    } else {
      return 'Week '.concat(weekNumber, ' of ').concat(durationValue, ', ').concat(dateRange);
    }
  } catch (error) {
    console.error('Error calculating display period:', error);
    return 'Timing not selected';
  }
};
var getOrdinalSuffix = function (day) {
  if (day > 3 && day < 21) return ''.concat(day, 'th'); // Covers 11-20
  switch (day % 10) {
    case 1:
      return ''.concat(day, 'st');
    case 2:
      return ''.concat(day, 'nd');
    case 3:
      return ''.concat(day, 'rd');
    default:
      return ''.concat(day, 'th');
  }
};
var formatMonthDayWithSuffix = function (date) {
  var month = date.toLocaleString('en-US', { month: 'long' });
  var day = getOrdinalSuffix(date.getDate());
  return ''.concat(month, ' ').concat(day);
};
var formatYear = function (date) {
  return date.getFullYear().toString();
};
export var displayDuration = function (startDate, duration) {
  var _a;
  if (!startDate || !duration) return 'Timing not selected';
  var _b = startDate.split('/').map(Number),
    month = _b[0],
    day = _b[1],
    year = _b[2];
  var start = new Date(year, month - 1, day);
  // Parse the duration
  var durationValue;
  var durationUnit;
  if (typeof duration === 'number') {
    durationValue = duration;
    durationUnit = 'weeks';
  } else {
    var durationParts = duration.split(' ');
    durationValue = Number(durationParts[0]);
    durationUnit =
      ((_a = durationParts[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'weeks';
  }
  // Calculate the end date
  var end;
  if (durationUnit === 'weeks' || durationUnit === 'week') {
    end = new Date(start);
    end.setDate(start.getDate() + durationValue * 7); // Add duration in days
  } else {
    throw new Error('Unsupported duration unit: '.concat(durationUnit));
  }
  var startFormatted = formatMonthDayWithSuffix(start);
  var endFormatted = formatMonthDayWithSuffix(end);
  var startYear = formatYear(start);
  var endYear = formatYear(end);
  // If both dates are in the same year, only show the year once
  var formattedYear =
    startYear === endYear ? startYear : ''.concat(startYear, ' - ').concat(endYear);
  return ''.concat(startFormatted, ' - ').concat(endFormatted, ' ').concat(formattedYear);
};
var getGMTOffset = function (timeZone) {
  var _a;
  try {
    var date = new Date();
    var timeZoneFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone,
      timeZoneName: 'shortOffset', // Gets the GMT offset like GMT+1
    });
    var parts = timeZoneFormatter.formatToParts(date);
    var gmtPart =
      (_a = parts.find(function (part) {
        return part.type === 'timeZoneName';
      })) === null || _a === void 0
        ? void 0
        : _a.value;
    return gmtPart || 'GMT'; // Fallback to GMT if undetectable
  } catch (error) {
    return 'GMT'; // Fallback in case of error
  }
};
var getUserTimeZone = function () {
  var regionTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return getGMTOffset(regionTimeZone);
};
export var getPostingSchedule = function (numPosts) {
  var possibleTimes = ['9 AM', '12 PM', '2 PM', '5 PM', '8 PM'];
  var userTimeZone = getUserTimeZone(); // Get user's timezone dynamically
  if (numPosts <= 0) return 'No scheduled posts';
  if (numPosts === 1) return ''.concat(possibleTimes[1], ' ').concat(userTimeZone);
  if (numPosts === 2)
    return ''.concat(possibleTimes[0], ', ').concat(possibleTimes[3], ' ').concat(userTimeZone);
  if (numPosts === 3)
    return ''
      .concat(possibleTimes[0], ', ')
      .concat(possibleTimes[2], ', ')
      .concat(possibleTimes[3], ' ')
      .concat(userTimeZone);
  if (numPosts === 4)
    return ''
      .concat(possibleTimes[0], ', ')
      .concat(possibleTimes[1], ', ')
      .concat(possibleTimes[2], ', ')
      .concat(possibleTimes[3], ' ')
      .concat(userTimeZone);
  // For 5-6 posts, include all available time slots
  return ''.concat(possibleTimes.join(', '), ' ').concat(userTimeZone);
};
export var getPostingScheduleArray = function (numPosts) {
  var possibleTimes = ['9 AM', '12 PM', '2 PM', '5 PM', '8 PM'];
  var userTimeZone = getUserTimeZone(); // Get user's timezone dynamically
  if (numPosts <= 0) return [];
  if (numPosts === 1) return [''.concat(possibleTimes[1], ' ').concat(userTimeZone)];
  if (numPosts === 2)
    return [
      ''.concat(possibleTimes[0], ' ').concat(userTimeZone),
      ''.concat(possibleTimes[3], ' ').concat(userTimeZone),
    ];
  if (numPosts === 3)
    return [
      ''.concat(possibleTimes[0], ' ').concat(userTimeZone),
      ''.concat(possibleTimes[2], ' ').concat(userTimeZone),
      ''.concat(possibleTimes[3], ' ').concat(userTimeZone),
    ];
  if (numPosts === 4)
    return [
      ''.concat(possibleTimes[0], ' ').concat(userTimeZone),
      ''.concat(possibleTimes[1], ' ').concat(userTimeZone),
      ''.concat(possibleTimes[2], ' ').concat(userTimeZone),
      ''.concat(possibleTimes[3], ' ').concat(userTimeZone),
    ];
  // For 5-6 posts, include all available time slots
  return possibleTimes.map(function (time) {
    return ''.concat(time, ' ').concat(userTimeZone);
  });
};
//# sourceMappingURL=calculateTiming.js.map
