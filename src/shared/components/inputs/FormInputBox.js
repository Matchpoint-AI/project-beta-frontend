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
import { jsx as _jsx } from 'react/jsx-runtime';
export default function FormInputBox(_a) {
  var color = _a.color,
    children = _a.children,
    styles = _a.styles;
  return _jsx('div', {
    className:
      'bg-gray-50 border rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 flex items-center justify-center gap-2',
    style: __assign({ borderColor: color }, styles),
    children: children,
  });
}
//# sourceMappingURL=FormInputBox.js.map
