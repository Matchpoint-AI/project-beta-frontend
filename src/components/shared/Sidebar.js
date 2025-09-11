import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
// import { Link } from "react-router-dom";
import SideNavBar from '../SideNavBar';
var Sidebar = function (_a) {
    var _b = _a.currentStep, currentStep = _b === void 0 ? 1 : _b;
    var _c = useState(false), displaySidebar = _c[0], setDisplaySidebar = _c[1];
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed top-0 left-0 h-screen w-20 bg-white z-50 shadow-md hidden md:block ".concat(currentStep === 6 ? 'blur-md' : ''), children: _jsx(SideNavBar, { phone: false }) }), _jsxs("div", { className: "fixed top-0 left-0 w-screen h-20 md:hidden flex items-center xs:justify-center justify-between bg-white px-5 z-50", children: [_jsx("img", { src: "/logo.svg", alt: "logo" }), _jsx(SideNavBar, { className: " bg-white w-20 absolute top-0 transition-all", style: { right: displaySidebar ? '0px' : '-80px' }, phone: true }), _jsx("button", { onClick: function () { return setDisplaySidebar(function (old) { return !old; }); }, children: _jsx("img", { src: "/burger.svg", alt: "burger-menu", className: "absolute top-1/2 right-0 mr-[26px] translate-y-[-50%]" }) })] })] }));
};
export default Sidebar;
//# sourceMappingURL=Sidebar.js.map