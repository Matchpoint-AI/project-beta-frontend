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
import { useState } from 'react';
import ChipComponent from '../../shared/components/ui/ChipComponent';
var AgeDropdown = function (_a) {
  var options = _a.options,
    currentValues = _a.currentValues,
    onUpdateContext = _a.onUpdateContext;
  var _b = useState(false),
    isOpen = _b[0],
    setIsOpen = _b[1];
  var _c = useState(
      currentValues !== null && currentValues !== void 0 ? currentValues : [options[0]]
    ),
    selectedOption = _c[0],
    setSelectedOption = _c[1];
  var handleOptionClick = function (option) {
    var found = selectedOption.includes(option);
    if (found === true) return;
    var found2 = selectedOption.includes('All Ages');
    if (found2 === true) return;
    if (selectedOption.length === 2) return;
    if (option === 'All Ages') {
      var selected_1 = [option];
      setSelectedOption(selected_1);
      setIsOpen(false);
      onUpdateContext(selected_1);
      return;
    }
    var selected = __spreadArray(__spreadArray([], selectedOption, true), [option], false);
    setSelectedOption(selected);
    setIsOpen(false);
    onUpdateContext(selected);
  };
  var handleDelete = function (index) {
    var newSelectedOption = __spreadArray([], selectedOption, true); // Create a copy of the array
    newSelectedOption.splice(index, 1); // Remove the element at the specified index
    setSelectedOption(newSelectedOption); // Update the state with the new array
    onUpdateContext(newSelectedOption);
  };
  return _jsxs('div', {
    className: 'relative inline-block text-left w-full',
    children: [
      _jsx('div', {
        className: 'flex justify-between',
        children: _jsxs('div', {
          // type="button"
          className:
            'hover:cursor-pointer inline-flex w-full items-center justify-between rounded-md px-4 py-2 bg-white text-sm font-medium border text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500',
          id: 'options-menu',
          'aria-haspopup': 'true',
          'aria-expanded': 'true',
          onClick: function () {
            return setIsOpen(!isOpen);
          },
          style: { height: '40px' },
          children: [
            _jsx('div', {
              className: 'w-full h-full flex overflow-hidden gap-2',
              style: { height: '100%' },
              children: selectedOption.map(function (option, index) {
                return _jsx(
                  ChipComponent,
                  {
                    index: index,
                    label: option,
                    selected: true,
                    onSelect: function () {},
                    onClose: handleDelete,
                  },
                  index
                );
              }),
            }),
            _jsx('svg', {
              className: '-mr-1 ml-2 h-5 w-5',
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 20 20',
              fill: 'currentColor',
              'aria-hidden': 'true',
              children: _jsx('path', {
                fillRule: 'evenodd',
                d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0L5.293 8.707a1 1 0 010-1.414z',
                clipRule: 'evenodd',
              }),
            }),
          ],
        }),
      }),
      isOpen &&
        _jsx('div', {
          className:
            'origin-top-right absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[999]',
          children: _jsx('div', {
            className: 'py-1',
            role: 'menu',
            'aria-orientation': 'vertical',
            'aria-labelledby': 'options-menu',
            children: options.map(function (option, index) {
              return _jsx(
                'div',
                {
                  className: 'block px-4 py-2 text-sm text-gray-700 '.concat(
                    selectedOption.includes(option) === true ? 'bg-gray-100' : '',
                    ' hover:bg-gray-100'
                  ),
                  role: 'menuitem',
                  onClick: function () {
                    handleOptionClick(option);
                    setIsOpen(false);
                  },
                  children: option,
                },
                index
              );
            }),
          }),
        }),
    ],
  });
};
export default AgeDropdown;
//# sourceMappingURL=AgeDropdown.js.map
