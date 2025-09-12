import { jsx as _jsx } from "react/jsx-runtime";
var ErrorDisplay = function (_a) {
    var error = _a.error;
    return (_jsx("div", { className: "w-full text-center  h-fit ".concat(error ? '' : 'hidden'), children: _jsx("h1", { className: "text-lg text-red-600 font-bold", children: error }) }));
};
export default ErrorDisplay;
//# sourceMappingURL=ErrorDisplay.js.map