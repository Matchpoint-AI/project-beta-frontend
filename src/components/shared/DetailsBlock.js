import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonBase } from '@mui/material';
import { FaRegEdit } from 'react-icons/fa';
export default function DetailsBlock(_a) {
    var title = _a.title, description = _a.description, children = _a.children, _onClick = _a.onClick, _b = _a.edit, edit = _b === void 0 ? true : _b;
    return (_jsxs("div", { className: "p-5 mb-[14px] rounded-md w-full bg-[#F6F5FF] border border-[#D1D5DB]", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "capitalize text-[#42389D] font-medium text-lg leading-7 mb-1", children: title }), edit ? (_jsx(ButtonBase, { onClick: _onClick, children: _jsx(FaRegEdit, { color: "#3F83F8", size: 16 }) })) : null] }), _jsx("p", { className: "text-[#111928] font-medium text-xs mb-5", children: description }), children] }));
}
//# sourceMappingURL=DetailsBlock.js.map