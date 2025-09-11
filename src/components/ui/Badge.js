import { jsx as _jsx } from 'react/jsx-runtime';
export var Badge = function (_a) {
  var children = _a.children,
    _b = _a.variant,
    variant = _b === void 0 ? 'default' : _b,
    _c = _a.className,
    className = _c === void 0 ? '' : _c;
  var variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };
  return _jsx('span', {
    className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium '
      .concat(variantClasses[variant], ' ')
      .concat(className),
    children: children,
  });
};
//# sourceMappingURL=Badge.js.map
