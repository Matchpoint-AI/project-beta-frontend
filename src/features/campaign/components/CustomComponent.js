import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var CustomComponent = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, _b = _a.isDialogOpen, isDialogOpen = _b === void 0 ? false : _b, children = _a.children;
    return (_jsxs("div", { className: "flex flex-col mt-6 lg:mt-28 w-full items-center", children: [_jsxs("div", { className: "w-full", children: [_jsx("h1", { className: "bg-gradient-to-r bg-clip-text text-transparent from-[#681DBA] to-[#FF43E1] text-[22px] md:text-2xl font-semibold ".concat(isDialogOpen ? 'blur-md' : ''), children: title }), _jsx("p", { className: "my-3 w-full ".concat(isDialogOpen ? 'blur-md' : ''), children: subtitle })] }), children] }));
};
export default CustomComponent;
//# sourceMappingURL=CustomComponent.js.map