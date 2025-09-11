import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { MdEdit } from 'react-icons/md';
export default function CampaignDetailsBlock(_a) {
    var title = _a.title, text = _a.text, review = _a.review;
    var _b = useState(false), edit = _b[0], setEdit = _b[1];
    var _c = useState(text), value = _c[0], setValue = _c[1];
    return (_jsxs("div", { className: "p-5 mb-[14px] rounded-md w-full border border-[#D1D5DB] group flex items-center justify-between ".concat(edit ? 'bg-white' : review ? 'bg-[#F6F5FF]' : 'bg-[#F6F5FF] hover:bg-[#DCD7FE]'), children: [_jsxs("div", { className: "flex-grow pr-2", children: [_jsx("h1", { className: "capitalize text-[#42389D] font-medium text-lg leading-7 mb-1", children: title }), !edit && _jsx("p", { className: "text-sm leading-5", children: value }), edit && (_jsx("textarea", { value: value, onChange: function (e) { return setValue(e.target.value); }, className: "rounded-lg w-full h-[150px] p-4 border border-[#D1D5DB] outline-none" }))] }), !review && (_jsxs(_Fragment, { children: [!edit && (_jsx("button", { type: "button", onClick: function () { return setEdit(true); }, className: "h-8 aspect-square rounded-full bg-[#362F78] p-[3px] hidden group-hover:flex items-center justify-center", children: _jsx(MdEdit, { color: "white", size: 25 }) })), edit && (_jsx("button", { type: "button", onClick: function () { return setEdit(false); }, className: "py-[5px] px-[14px] uppercase font-medium text-white bg-[#0E9F6E] text-[12px] rounded", children: "save" }))] }))] }));
}
//# sourceMappingURL=CampaignDetailsBlock.js.map