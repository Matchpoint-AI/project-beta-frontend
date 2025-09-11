import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import PickColor from 'react-pick-color';
export default function HslColorPicker() {
  var _a = useState('#9751F2'),
    color = _a[0],
    setColor = _a[1];
  return _jsxs('div', {
    className: 'w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg',
    children: [
      _jsx(PickColor, {
        color: color,
        onChange: function (color) {
          return setColor(color.hex);
        },
        theme: {
          background: 'transparent',
          inputBackground: '#ffffff',
          color: '#333333',
        },
      }),
      _jsx('style', {
        children:
          "\n        /* Hide increment/decrement arrows on number inputs */\n        input[type='number']::-webkit-inner-spin-button,\n        input[type='number']::-webkit-outer-spin-button {\n          -webkit-appearance: none;\n          margin: 0;\n        }\n\n        input[type='number'] {\n          -moz-appearance: textfield;\n        }\n\n        /* Move labels to top */\n        .rpc-fields-element {\n          flex-direction: column !important;\n          align-items: center !important;\n        }\n\n        .rpc-fields-element-label {\n          margin-bottom: 4px !important;\n          margin-right: 0 !important;\n        }\n      ",
      }),
    ],
  });
}
//# sourceMappingURL=HslColorPicker.js.map
