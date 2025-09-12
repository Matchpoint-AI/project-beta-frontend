import { jsx as _jsx } from "react/jsx-runtime";
var Pagination = function (_a) {
    var totalPages = _a.totalPages, currentPage = _a.currentPage, onPageChange = _a.onPageChange, _b = _a.prefixText, prefixText = _b === void 0 ? '' : _b;
    return (_jsx("div", { className: "flex items-center mt-2 h-9", children: Array.from({ length: totalPages }, function (_, index) { return (_jsx("button", { className: "px-4 py-1 ".concat(index === 0 ? 'rounded-l-md' : '', " ").concat(index === totalPages - 1 ? 'rounded-r-md' : '', " ").concat(currentPage === index + 1
                ? 'bg-[#E5EDFF] text-[#5145CD] border border-indigo-100'
                : 'bg-white text-gray-400 border border-gray-200'), onClick: function () { return onPageChange(index + 1); }, children: !prefixText ? index + 1 : "".concat(prefixText, " ").concat(index + 1) }, index)); }) }));
};
export default Pagination;
//# sourceMappingURL=Pagination.js.map