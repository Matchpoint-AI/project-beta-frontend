import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { UsersContext } from '../../context/UsersContext';
import { useAuth } from '../../features/auth/context/AuthContext';
import posthog from '../../helpers/posthog';
function TableDataCell(_a) {
    var content = _a.content;
    return (_jsx("td", { className: "user-data-cell py-3 px-4 max-w-[200px]", children: _jsx("div", { className: "w-full overflow-x-auto box-border group-hover:text-white p-0 text-[#111928] font-medium", children: content }) }));
}
export default function UsersTable() {
    var usersContext = useContext(UsersContext);
    var profile = useAuth().profile;
    var _a = useState(1), page = _a[0], setPage = _a[1];
    var navigate = useNavigate();
    var handleChangePage = function (incr) {
        var newPage = page + incr;
        if (newPage > 0 && newPage * 10 - 9 <= usersContext.total)
            setPage(newPage);
        if (newPage * 10 > usersContext.users.length) {
            usersContext.handleNextPage();
        }
    };
    var handleCellClick = function (id) {
        if (posthog.__loaded) {
            posthog.capture('Admin Accessed User Management', {
                distinct_id: profile === null || profile === void 0 ? void 0 : profile.id,
            });
        }
        navigate(id);
    };
    return (_jsxs("div", { className: "h-5", children: [_jsxs("table", { className: "w-full border-collapse text-[14px] rounded-t-md overflow-hidden", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#5145CD] text-white p-2 rounded-t-md text-left font-semibold", children: [_jsx("th", { className: "py-3 px-4 capitalize", children: "name" }), _jsx("th", { className: "py-3 px-4 capitalize", children: "email" }), _jsx("th", { className: "py-3 px-4 capitalize", children: "business" }), _jsx("th", { className: "py-3 px-4 capitalize", children: "plan" }), _jsx("th", { className: "py-3 px-4 capitalize", children: "campaigns" }), _jsx("th", { className: "py-3 px-4 capitalize", children: "joined" })] }) }), _jsx("tbody", { children: usersContext.users.slice(page * 10 - 10, page * 10).map(function (u, i) {
                            var date = new Date(u.created_at * 1000);
                            var formattedDate = new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                timeZone: 'UTC',
                            }).format(date);
                            return (_jsxs("tr", { onClick: function () { return handleCellClick(u.id); }, className: "group border-b border-[#ddd] ".concat(i % 2 ? 'bg-[#5145CD1A]' : 'bg-transparent', " hover:bg-[#5145CD] cursor-pointer"), children: [_jsx(TableDataCell, { content: u === null || u === void 0 ? void 0 : u.name }), _jsx(TableDataCell, { content: u === null || u === void 0 ? void 0 : u.email }), _jsx(TableDataCell, { content: (u === null || u === void 0 ? void 0 : u.business) || 'None' }), _jsx(TableDataCell, { content: u === null || u === void 0 ? void 0 : u.plan }), _jsx(TableDataCell, { content: u === null || u === void 0 ? void 0 : u.totalCampaigns }), _jsx(TableDataCell, { content: formattedDate })] }, u.id));
                        }) })] }), _jsxs("div", { className: "bg-[#5145CD] py-2 flex items-center justify-center text-white text-sm rounded-b-md", children: [_jsx("button", { type: "button", onClick: function () { return handleChangePage(-1); }, children: _jsx(MdKeyboardArrowLeft, { color: "white", size: 20 }) }), _jsxs("span", { children: [page * 10 - 9, " - ", page * 10, " of ", usersContext.total] }), _jsx("button", { type: "button", onClick: function () { return handleChangePage(1); }, children: _jsx(MdKeyboardArrowRight, { color: "white", size: 20 }) })] })] }));
}
//# sourceMappingURL=UsersTable.js.map