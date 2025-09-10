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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import * as convert from 'color-convert';
function ColorCodeInput(_a) {
  var onChange = _a.onChange,
    value = _a.value,
    type = _a.type,
    className = _a.className;
  var handleChange = function (e) {
    if (type === 'hex') onChange(e.target.value);
    else onChange(Number(e.target.value), type);
  };
  return _jsxs(_Fragment, {
    children: [
      _jsx('label', { htmlFor: type, className: 'text-[12px]', children: type.toUpperCase() }),
      _jsx('input', {
        type: 'text',
        value: value,
        name: type,
        id: type,
        onChange: handleChange,
        className: 'text-[14px] py-1 px-2 outline-none border border-gray-400 '.concat(className),
      }),
    ],
  });
}
export default function ColorPicker(_a) {
  var selectedColors = _a.selectedColors,
    selectColor = _a.selectColor,
    saveColor = _a.saveColor,
    className = _a.className,
    conseilPicker = _a.conseilPicker;
  // const [selectedColors, setSelectedColors] = useState<any>([]);
  var _b = useState([255, 255, 255]),
    rgbColor = _b[0],
    setRgbColor = _b[1];
  var _c = useState('#ffffff'),
    hexColor = _c[0],
    setHexColor = _c[1];
  var handleColorChange = function (newColor) {
    // setSelectedColors([...selectedColors, newColor]);
    var rgb = convert.hex.rgb(newColor);
    setHexColor(newColor);
    setRgbColor(__spreadArray([], rgb, true));
  };
  var handleRgbChange = function (newColor, unit) {
    var pos = 'rgb'.indexOf(unit);
    var newHex = '';
    setRgbColor(function (old) {
      old[pos] = newColor >= 255 ? 255 : newColor;
      newHex = convert.rgb.hex(old[0], old[1], old[2]);
      return old;
    });
    setHexColor('#' + newHex);
  };
  var handleHexChange = function (newHex) {
    if (newHex.length > 7) return;
    if (!newHex.includes('#')) newHex = '#' + newHex;
    if (!/[0-9A-Fa-f#]/.test(newHex[newHex.length - 1])) newHex = hexColor + 'f';
    var rgb = convert.hex.rgb(newHex);
    setHexColor(newHex);
    setRgbColor(__spreadArray([], rgb, true));
  };
  var handleSaveColor = function () {
    if (selectedColors.length >= 2) return;
    saveColor(function (old) {
      var businessObj = __assign({}, old);
      if (businessObj.brandColors) businessObj.brandColors.push(hexColor);
      else businessObj.brandColors = [hexColor];
      return businessObj;
    });
    selectColor(function (old) {
      return __spreadArray(__spreadArray([], old, true), [hexColor], false);
    });
    conseilPicker(false);
  };
  return _jsxs('div', {
    className: 'w-fit bg-gray-50 p-2 rounded-md '.concat(className),
    children: [
      _jsx(HexColorPicker, { color: hexColor || '#FFFFFF', onChange: handleColorChange }),
      _jsxs('div', {
        className: 'flex gap-2 mt-3',
        children: [
          _jsx('div', {
            className: 'flex flex-col',
            children: _jsx(ColorCodeInput, {
              onChange: handleHexChange,
              value: hexColor,
              type: 'hex',
              className: 'w-[80px] rounded-md',
            }),
          }),
          _jsxs('div', {
            className: 'flex',
            children: [
              _jsx('span', {
                className: 'flex flex-col',
                children: _jsx(ColorCodeInput, {
                  onChange: handleRgbChange,
                  value: rgbColor[0],
                  type: 'r',
                  className: 'w-[50px] rounded-tl-md rounded-bl-md',
                }),
              }),
              _jsx('span', {
                className: 'flex flex-col',
                children: _jsx(ColorCodeInput, {
                  onChange: handleRgbChange,
                  value: rgbColor[1],
                  type: 'g',
                  className: 'w-[50px]',
                }),
              }),
              _jsx('span', {
                className: 'flex flex-col',
                children: _jsx(ColorCodeInput, {
                  onChange: handleRgbChange,
                  value: rgbColor[2],
                  type: 'b',
                  className: 'w-[50px] rounded-tr-md rounded-br-md',
                }),
              }),
            ],
          }),
        ],
      }),
      _jsx('button', {
        type: 'button',
        className: 'bg-main-purple font-medium text-white w-full mt-3 p-2 rounded-md capitalize',
        onClick: handleSaveColor,
        children: 'Choose',
      }),
    ],
  });
}
//# sourceMappingURL=ColorPicker.js.map
