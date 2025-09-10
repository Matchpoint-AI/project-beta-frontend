import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, useRef, useState } from 'react';
var Dropdown = function (_a) {
  var options = _a.options,
    currentValue = _a.currentValue,
    onUpdateContext = _a.onUpdateContext,
    className = _a.className,
    _b = _a.dynamic,
    dynamic = _b === void 0 ? false : _b;
  var _c = useState(false),
    isOpen = _c[0],
    setIsOpen = _c[1];
  var _d = useState(0),
    dropdownWidth = _d[0],
    setDropdownWidth = _d[1];
  var containerRef = useRef(null);
  // logic for width to adapt to longest option
  // useEffect(() => {
  //   // Calculate the width of the largest string
  //   if (containerRef.current) {
  //     const tempSpan = document.createElement("span");
  //     tempSpan.style.font = window.getComputedStyle(containerRef.current).font;
  //     tempSpan.style.visibility = "hidden";
  //     tempSpan.style.whiteSpace = "nowrap";
  //     document.body.appendChild(tempSpan);
  //     let maxWidth = 0;
  //     options.forEach((option) => {
  //       tempSpan.textContent = option;
  //       maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
  //     });
  //     setDropdownWidth(maxWidth + 60); // Add some padding
  //     document.body.removeChild(tempSpan);
  //   }
  // }, [options]);
  // logic for width to adapt to chosen option
  // useEffect(() => {
  //   // Calculate the width of the current selected option
  //   if (containerRef.current && currentValue) {
  //     const tempSpan = document.createElement("span");
  //     tempSpan.style.font = window.getComputedStyle(containerRef.current).font;
  //     tempSpan.style.visibility = "hidden";
  //     tempSpan.style.whiteSpace = "nowrap";
  //     document.body.appendChild(tempSpan);
  //     tempSpan.textContent = currentValue;
  //     if (currentValue === "All") {
  //       const calculatedWidth = tempSpan.offsetWidth + 70; // Add padding
  //       setDropdownWidth(calculatedWidth);
  //     } else {
  //       const calculatedWidth = tempSpan.offsetWidth + 60; // Add padding
  //       setDropdownWidth(calculatedWidth);
  //     }
  //     document.body.removeChild(tempSpan);
  //   }
  // }, [currentValue]);
  useEffect(
    function () {
      if (dynamic) {
        if (containerRef.current) {
          var tempSpan = document.createElement('span');
          tempSpan.style.font = window.getComputedStyle(containerRef.current).font;
          tempSpan.style.visibility = 'hidden';
          tempSpan.style.whiteSpace = 'nowrap';
          document.body.appendChild(tempSpan);
          if (!currentValue) return;
          // Calculate width for the currently selected option
          tempSpan.textContent = currentValue;
          if (currentValue === 'All') {
            var calculatedWidth = tempSpan.offsetWidth + 70; // Add padding
            setDropdownWidth(calculatedWidth);
          } else {
            var calculatedWidth = tempSpan.offsetWidth + 60; // Add padding
            setDropdownWidth(calculatedWidth);
          }
          // const calculatedWidth = tempSpan.offsetWidth + 60; // Add padding
          // setDropdownWidth(calculatedWidth);
          document.body.removeChild(tempSpan);
        }
      } else {
        // Calculate the width of the largest option when not dynamic
        if (containerRef.current) {
          var tempSpan_1 = document.createElement('span');
          tempSpan_1.style.font = window.getComputedStyle(containerRef.current).font;
          tempSpan_1.style.visibility = 'hidden';
          tempSpan_1.style.whiteSpace = 'nowrap';
          document.body.appendChild(tempSpan_1);
          var maxWidth_1 = 0;
          options.forEach(function (option) {
            tempSpan_1.textContent = option;
            maxWidth_1 = Math.max(maxWidth_1, tempSpan_1.offsetWidth);
          });
          setDropdownWidth(maxWidth_1 + 60); // Add padding
          document.body.removeChild(tempSpan_1);
        }
      }
    },
    [options, currentValue, dynamic]
  );
  var handleOptionClick = function (option, index) {
    setIsOpen(false);
    onUpdateContext(option, index);
  };
  return _jsxs('div', {
    ref: containerRef,
    className: 'relative inline-block text-left '.concat(
      className !== null && className !== void 0 ? className : ''
    ),
    // style={{ width: `${dropdownWidth}px` }}
    style: dynamic ? { width: ''.concat(dropdownWidth, 'px') } : {},
    children: [
      _jsx('div', {
        className: 'flex justify-between',
        children: _jsxs('button', {
          type: 'button',
          className:
            'inline-flex w-full justify-between items-center rounded-md px-4 py-2 bg-white text-sm font-medium border text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500',
          id: 'options-menu',
          'aria-haspopup': 'true',
          'aria-expanded': 'true',
          onClick: function () {
            return setIsOpen(!isOpen);
          },
          children: [
            _jsx('span', { className: 'capitalize', children: currentValue }),
            _jsx('svg', {
              className: 'h-5 w-5',
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
          // style={{ width: `${dropdownWidth}px` }}
          style: dynamic ? { width: ''.concat(dropdownWidth, 'px') } : {},
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
                  className: 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize',
                  role: 'menuitem',
                  onClick: function () {
                    handleOptionClick(option, index);
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
export default Dropdown;
//# sourceMappingURL=Dropdown.js.map
