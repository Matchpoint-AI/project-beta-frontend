import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from '../components/shared/Sidebar';
import UsersTable from '../components/users/UsersTable';
export default function ManageUsers() {
    return (_jsx("div", { className: "w-full h-full", children: _jsxs("div", { className: "flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF] overflow-y-auto", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "md:ml-[80px] flex-grow flex flex-col gap-8 p-8 md:mt-8 mt-[80px]", children: [_jsx("h1", { className: " font-semibold text-[30px] text-[#5145CD] capitalize", children: "Users" }), _jsx(UsersTable, {})] })] }) }));
}
//# sourceMappingURL=ManageUsers.js.map