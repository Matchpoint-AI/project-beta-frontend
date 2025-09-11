import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
var PaginationImage = function (_a) {
    var currentPage = _a.currentPage, approved = _a.approved, onPageChange = _a.onPageChange, images = _a.images;
    return (_jsx("div", { className: "flex justify-center items-center h-full mt-0 text-black font-semibold", children: images.slice(0, 3).map(function (_, i) {
            var isCurrent = i + 1 === currentPage;
            return (_jsx("button", { disabled: approved, onClick: function () { return onPageChange(i + 1); }, className: "\n          px-4 py-1 border\n          first:rounded-l-md\n          last:rounded-r-md \n          ".concat(approved ? 'hover:cursor-not-allowed' : '', "\n        "), children: isCurrent ? (_jsxs("span", { className: "block rounded-full bg-[#5145CD]/30 px-2 py-0.5", children: [i + 1, " "] })) : (_jsxs("span", { className: "block rounded-full bg-transparent px-2 py-0.5", children: [i + 1, " "] })) }, i));
        }) }));
};
export default PaginationImage;
//# sourceMappingURL=PaginationImage.js.map