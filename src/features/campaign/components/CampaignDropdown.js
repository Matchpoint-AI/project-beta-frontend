import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var Dropdown = function (_a) {
    var open = _a.open, setOpen = _a.setOpen, options = _a.options, currentValue = _a.currentValue, onUpdateContext = _a.onUpdateContext, className = _a.className;
    // useEffect(() => {
    //   onUpdateContext(options[0]);
    // }, []);
    var handleOptionClick = function (option, index) {
        // setSelectedOption(option);
        setOpen(false);
        // purpose? setCampaignInfo({ ...campaignInfo, purpose: "Awareness / Excitement about " + option }) : setCampaignInfo({ ...campaignInfo, product: option });
        onUpdateContext(option, index);
    };
    // useEffect(() => {
    //   if (type === "options") {
    //     // setSelectedOption(options[0]);
    //   }
    // }, [options]);
    return (_jsxs("div", { className: "relative inline-block text-left ".concat(className !== null && className !== void 0 ? className : ''), children: [_jsx("div", { className: "flex justify-between", children: _jsxs("button", { type: "button", className: "inline-flex w-full justify-between items-center rounded-md px-4 py-2 bg-white text-sm font-medium border text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500", id: "options-menu", "aria-haspopup": "true", "aria-expanded": "true", onClick: function () { return setOpen(!open); }, children: [_jsx("span", { className: "capitalize", children: currentValue }), _jsx("svg", { className: "h-5 w-5", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0L5.293 8.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })] }) }), open && (_jsx("div", { className: "origin-top-right absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[999]", children: _jsx("div", { className: "py-1", role: "menu", "aria-orientation": "vertical", "aria-labelledby": "options-menu", children: options.map(function (option, index) { return (_jsx("div", { className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize", role: "menuitem", onClick: function () {
                            handleOptionClick(option, index);
                            setOpen(false);
                        }, children: option }, index)); }) }) }))] }));
};
export default Dropdown;
//# sourceMappingURL=CampaignDropdown.js.map