import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
var navigation = [
    { name: 'Profile', href: '/profile' },
    { name: 'Social Account Connections', href: '/profile/integrations' },
];
export default function SettingsLayout() {
    return (_jsxs(_Fragment, { children: [_jsx(Sidebar, {}), _jsxs("main", { className: "flex flex-col px-8 pt-28 md:pt-12 md:pl-28 bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF] ", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Settings" }), _jsx("header", { className: "pl-4 ", children: _jsx("nav", { className: "flex overflow-x-auto py-4 ", children: _jsx("ul", { role: "list", className: "\n                flex min-w-full \n                flex-none \n                gap-x-6 \n                text-sm font-semibold \n                leading-6 text-gray-600\n                ", children: navigation.map(function (item) { return (_jsx("li", { children: _jsx(NavLink, { to: item.href, className: function (_a) {
                                            var isActive = _a.isActive;
                                            return isActive ? 'text-indigo-600' : '';
                                        }, end: true, children: item.name }) }, item.name)); }) }) }) }), _jsx(Outlet, {})] })] }));
}
//# sourceMappingURL=layout.js.map