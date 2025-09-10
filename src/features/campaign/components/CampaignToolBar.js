import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
// import Dropdown from '../../../shared/components/ui/Dropdown';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
var CampaignToolBar = function (props) {
  var _a = useState(''),
    selectedMonth = _a[0],
    setSelectedMonth = _a[1];
  var _b = useState(new Date().getFullYear()),
    selectedYear = _b[0],
    setSelectedYear = _b[1];
  // Month options
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  // Year options (current year ± 10 years)
  var currentYear = new Date().getFullYear();
  var years = Array.from({ length: 21 }, function (_, i) {
    return currentYear - 10 + i;
  });
  // Handle month change
  var handleMonthChange = function (e) {
    var month = e.target.value;
    var updatedDate = new Date(props.date);
    updatedDate.setMonth(months.indexOf(month));
    props.onNavigate('DATE', updatedDate);
    setSelectedMonth(month);
  };
  // Handle year change
  var handleYearChange = function (e) {
    var year = parseInt(e.target.value);
    var updatedDate = new Date(props.date);
    updatedDate.setFullYear(year);
    props.onNavigate('DATE', updatedDate);
    setSelectedYear(year);
  };
  // Simple month navigation
  var handleForward = function () {
    return props.onNavigate('NEXT');
  };
  var handleBackward = function () {
    return props.onNavigate('PREV');
  };
  // Initialize selected month/year from props
  useEffect(
    function () {
      var _a = props.label.split(' '),
        month = _a[0],
        year = _a[1];
      setSelectedMonth(month);
      setSelectedYear(parseInt(year));
    },
    [props.label]
  );
  return _jsx('div', {
    className: 'w-full h-16 flex flex-row justify-center items-center mb-6',
    children: _jsxs('div', {
      className: 'w-fit h-10 flex flex-row gap-4 items-center',
      children: [
        _jsx(IoIosArrowBack, {
          className: 'w-5 h-5 hover:cursor-pointer',
          onClick: handleBackward,
        }),
        _jsx('select', {
          value: selectedMonth,
          onChange: handleMonthChange,
          className: 'p-1 border rounded',
          children: months.map(function (month) {
            return _jsx('option', { value: month, children: month }, month);
          }),
        }),
        _jsx('select', {
          value: selectedYear,
          onChange: handleYearChange,
          className: 'p-1 border rounded',
          children: years.map(function (year) {
            return _jsx('option', { value: year, children: year }, year);
          }),
        }),
        _jsx(IoIosArrowForward, {
          className: 'w-5 h-5 hover:cursor-pointer',
          onClick: handleForward,
        }),
      ],
    }),
  });
};
export default CampaignToolBar;
//# sourceMappingURL=CampaignToolBar.js.map
