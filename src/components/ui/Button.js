import { jsx as _jsx } from 'react/jsx-runtime';
export var Button = function (_a) {
  var children = _a.children,
    onClick = _a.onClick,
    _b = _a.variant,
    variant = _b === void 0 ? 'primary' : _b,
    _c = _a.size,
    size = _c === void 0 ? 'md' : _c,
    _d = _a.disabled,
    disabled = _d === void 0 ? false : _d,
    _e = _a.className,
    className = _e === void 0 ? '' : _e,
    _f = _a.type,
    type = _f === void 0 ? 'button' : _f;
  var variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  };
  var sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return _jsx('button', {
    type: type,
    onClick: onClick,
    disabled: disabled,
    className:
      '\n        inline-flex items-center justify-center rounded-md font-medium \n        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500\n        disabled:opacity-50 disabled:cursor-not-allowed\n        '
        .concat(variantClasses[variant], ' \n        ')
        .concat(sizeClasses[size], ' \n        ')
        .concat(className, '\n      '),
    children: children,
  });
};
//# sourceMappingURL=Button.js.map
