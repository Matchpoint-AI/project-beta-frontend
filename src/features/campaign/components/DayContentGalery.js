import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
function PostCard(_a) {
    var post = _a.post, num = _a.num;
    var _b = useState(0), image = _b[0], setImage = _b[1];
    return (_jsxs("div", { className: "max-w-[350px] aspect-[7/11] rounded-3xl overflow-hidden relative flex flex-col items-center justify-between shadow-md m-5", children: [_jsxs("div", { className: "bg-gradient-to-b from-[#000000ff] to-[#00000000] p-5 z-50 w-full flex items-center justify-between", children: [_jsx("span", { className: "text-white font-medium text-sm", children: "Post ".concat(num) }), post.images.length > 1 && (_jsx("div", { children: Array.from({ length: post.images.length }, function (_, i) { return i; }).map(function (i) { return (_jsx("button", { onClick: function () { return setImage(i); }, className: "h-3 aspect-square rounded-full ml-3 ".concat(i === image ? 'bg-[#8175ff]' : 'bg-white') }, i)); }) }))] }), _jsx("div", { style: {
                    backgroundImage: "url(".concat(post.images[image], ")"),
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }, className: "w-full h-[350px] absolute top-0 left-0 z-0" }), _jsxs("div", { className: "relative p-3 rounded-t-3xl bg-white h-[260px]", children: [_jsx("span", { className: "bg-[#5145CD] py-1 px-4 font-medium text-white absolute top-[-16px] left-1/2 translate-x-[-50%] rounded-full shadow-md shadow-[#5145CD80]", children: "Caption" }), _jsx("p", { style: { height: 'calc(85% - 20px)' }, className: "post-caption text-[#111928] w-full text-[13px] mt-5 overflow-y-auto", children: post.text }), post.posted && (_jsxs("div", { className: "mt-3 w-[100px] h-[25px] rounded-full bg-[#60e856] flex items-center shadow-md ", children: [_jsx("div", { className: "h-[25px] aspect-square bg-[#4BB543]  rounded-full flex items-center justify-center", children: _jsx(FaCheck, { size: 13, color: "white" }) }), _jsx("div", { className: "font-semibold text-white capitalize ml-2", children: "Posted" })] }))] })] }));
}
export default function DayContentGalery(_a) {
    var num = _a.num, content = _a.content;
    return (_jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-[#5145CD] font-medium text-2xl ml-5 mb-5", children: "Day ".concat(num) }), _jsx("div", { className: "flex items-center justify-evenly flex-wrap", children: content.map(function (p, i) {
                    return _jsx(PostCard, { post: p, num: i + 1 }, i);
                }) })] }));
}
//# sourceMappingURL=DayContentGalery.js.map