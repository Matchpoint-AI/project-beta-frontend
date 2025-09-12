import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import posthog from '../../../helpers/posthog';
export default function Navbar(_a) {
    var _b = _a.style, style = _b === void 0 ? '' : _b;
    var profile = useAuth().profile;
    var _c = useState(false), displaySidebar = _c[0], setDisplaySidebar = _c[1];
    var hash = useLocation().hash; // Get the current hash from the URL
    var isActive = function (section) { return hash === section; }; // Check if the current hash matches the section
    var handleToLanding = function () {
        if (posthog.__loaded) {
            posthog.capture('Navigated to Landing Page', {
                distinct_id: (profile === null || profile === void 0 ? void 0 : profile.id) || 'anonymous_user',
            });
        }
    };
    if (style !== '') {
        return (
        // <nav
        //   className={` z-20 top-0 start-0   flex flex-wrap items-center justify-center gap-10 mx-auto p-4 bg-transparent `}
        // >
        _jsxs("nav", { className: "fixed lg:static w-full z-20 top-0 start-0 flex gap-10 md:justify-center md:items-center bg-white md:bg-transparent mx-auto p-4", children: [_jsx("button", { type: "button", onClick: handleToLanding, children: _jsx(Link, { to: "/landing", className: "items-center space-x-3 rtl:space-x-reverse flex md:hidden", children: _jsx("img", { src: "logo.svg", className: "h-8", alt: "Matchpoint Logo" }) }) }), _jsx("div", { className: "items-center justify-center  hidden w-full md:flex md:w-auto md:order-1 ", children: _jsx("ul", { className: "flex flex-col gap-5 p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0", children: [
                            { href: '#product', label: 'Product' },
                            { href: '#features', label: 'Features' },
                            { href: '#about', label: 'About' },
                        ].map(function (item) { return (_jsx("li", { children: _jsx("a", { href: item.href, className: "block py-2 px-3 rounded md:p-0 ".concat(isActive(item.href)
                                    ? 'text-[#5145CD]'
                                    : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD]'), "aria-current": isActive(item.href) ? 'page' : undefined, children: item.label }) }, item.href)); }) }) }), _jsxs("div", { className: "hidden md:flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center", children: [_jsx(Link, { to: "/login", type: "button", className: "text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mx-3", children: "Log In" }), _jsx(Link, { to: "/signup", type: "button", className: "text-white bg-[#5145CD] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center", children: "Sign Up" })] }), _jsx("button", { onClick: function () { return setDisplaySidebar(function (old) { return !old; }); }, className: "block md:hidden absolute right-4 top-1/2 translate-y-[-50%]", children: _jsx("img", { src: "/burger.svg", alt: "burger-menu" }) }), displaySidebar && (_jsxs("div", { className: "bg-white absolute right-0 top-full h-screen p-3 shadow-lg", children: [_jsx("div", { className: "flex-col items-center justify-between w-full flex md:w-auto md:order-1", children: _jsx("ul", { className: "flex flex-col mt-4 font-medium rtl:space-x-reverse", children: [
                                    { href: '#product', label: 'Product' },
                                    { href: '#features', label: 'Features' },
                                    { href: '#about', label: 'About' },
                                    // { href: "#contact", label: "Contact" },
                                ].map(function (item) { return (_jsx("li", { children: _jsx("a", { href: item.href, onClick: function () { return setDisplaySidebar(function (old) { return !old; }); }, className: "block py-2 px-3 rounded md:p-0 ".concat(isActive(item.href)
                                            ? 'text-white bg-[#5145CD]'
                                            : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#5145CD]'), "aria-current": isActive(item.href) ? 'page' : undefined, children: item.label }) }, item.href)); }) }) }), _jsxs("div", { className: "flex flex-col items-center mt-5 ", children: [_jsx(Link, { to: "/login", type: "button", className: "text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mx-3", children: "Log In" }), _jsx(Link, { to: "/signup", type: "button", className: "text-white bg-[#5145CD] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center", children: "Sign Up" })] })] }))] }));
    }
    return (_jsxs("nav", { className: " fixed w-screen z-20 top-0 start-0 border-b border-gray-200 flex flex-wrap items-center justify-center bg-white md:justify-between  mx-auto p-4", children: [_jsx("button", { type: "button", onClick: handleToLanding, children: _jsx(Link, { to: "/landing", className: "items-center space-x-3 rtl:space-x-reverse flex md:hidden", children: _jsx("img", { src: "logo.svg", className: "h-8", alt: "Matchpoint Logo" }) }) }), _jsxs("div", { className: "hidden md:flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center", children: [_jsx(Link, { to: "/login", type: "button", className: "text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mx-3", children: "Log In" }), _jsx(Link, { to: "/signup", type: "button", className: "text-white bg-[#5145CD] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center", children: "Sign Up" })] }), _jsx("button", { onClick: function () { return setDisplaySidebar(function (old) { return !old; }); }, className: "block md:hidden absolute right-4 top-1/2 translate-y-[-50%]", children: _jsx("img", { src: "/burger.svg", alt: "burger-menu" }) }), displaySidebar && (_jsx("div", { className: "bg-white absolute right-0 top-full h-screen p-3 shadow-lg", children: _jsxs("div", { className: "flex flex-col items-center mt-5 ", children: [_jsx(Link, { to: "/login", type: "button", className: "text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mx-3", children: "Log In" }), _jsx(Link, { to: "/signup", type: "button", className: "text-white bg-[#5145CD] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center", children: "Sign Up" })] }) }))] }));
}
//# sourceMappingURL=Navbar.js.map