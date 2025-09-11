import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
var ChipComponent = function (_a) {
  var index = _a.index,
    label = _a.label,
    selected = _a.selected,
    onClose = _a.onClose,
    onSelect = _a.onSelect,
    className = _a.className;
  var _b = useState(false),
    hover = _b[0],
    setHover = _b[1];
  return _jsxs('div', {
    className:
      'inline-flex items-center gap-1 text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md px-[10px] py-[2px] mr-3 hover:bg-[#F98080] '.concat(
        className
      ),
    style: { backgroundColor: hover ? '#F98080' : selected ? '#84E1BC' : '#D1D5DB' },
    children: [
      _jsx('button', {
        type: 'button',
        className: 'font-medium text-[#111928]',
        onClick: function () {
          return onSelect(index);
        },
        children: label,
      }),
      _jsx('button', {
        type: 'button',
        onMouseEnter: function () {
          return setHover(true);
        },
        onMouseLeave: function () {
          return setHover(false);
        },
        onClick: function () {
          return onClose(index);
        },
        children: _jsx('img', { src: '/delete_tag.svg' }),
      }),
    ],
  });
};
export default ChipComponent;
//# sourceMappingURL=ChipComponent.js.map
