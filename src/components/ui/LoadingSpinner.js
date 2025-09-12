import { jsx as _jsx } from "react/jsx-runtime";
export var LoadingSpinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'md' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };
    return (_jsx("div", { className: "flex justify-center items-center ".concat(className), children: _jsx("div", { className: "".concat(sizeClasses[size], " border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"), role: "status", "aria-label": "Loading", children: _jsx("span", { className: "sr-only", children: "Loading..." }) }) }));
};
//# sourceMappingURL=LoadingSpinner.js.map