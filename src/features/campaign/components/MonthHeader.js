import { jsx as _jsx } from 'react/jsx-runtime';
var MonthHeader = function (props) {
  var whichDay = function () {
    var label = props.label;
    // Array of full day names
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Find the day that matches the first three letters of the label
    var matchedDay = daysOfWeek.find(function (day) {
      return day.startsWith(label);
    });
    return matchedDay;
  };
  return _jsx('div', {
    className: 'w-full h-full p-5 flex justify-center items-center border-none',
    children: _jsx('h1', { children: whichDay() }),
  });
};
export default MonthHeader;
//# sourceMappingURL=MonthHeader.js.map
