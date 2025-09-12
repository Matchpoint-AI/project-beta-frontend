import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Icon components can be added here or imported from a library like react-icons
var StepIcon = function (_a) {
    var icon = _a.icon;
    return (_jsx("div", { className: "flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 bg-purple-200 rounded-full text-purple-800 border-[6px] border-[#FBE2FF]", children: _jsx("img", { src: icon, className: "w-8 h-8 lg:w-10 lg:h-10", alt: "Step Icon" }) }));
};
var Step = function (_a) {
    var icon = _a.icon, title = _a.title, description = _a.description;
    return (_jsxs("div", { className: "flex flex-row lg:flex-col  items-center gap-6 w-full lg:w-[304px] text-center", children: [_jsx(StepIcon, { icon: icon }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("h3", { className: "text-3xl text-left lg:text-4xl lg:text-center lg:leading-[45px] font-medium tracking-tight text-[#221F28]", children: title }), _jsx("p", { className: "text-lg text-left lg:text-center lg:text-xl lg:leading-[27px] font-medium text-gray-800", children: description })] })] }));
};
// Arrow component
var Arrow = function () { return (_jsxs("div", { className: "ml-4 flex self-start lg:self-auto items-center justify-center", children: [_jsx("svg", { className: "w-16 h-16 lg:hidden text-[#DEDAE7]", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12 5V19M12 19L19 12M12 19L5 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }), _jsx("img", { src: 'arrow.svg', className: "hidden lg:block w-56", alt: "Step Icon" })] })); };
var HowBanner = function () {
    return (_jsx("div", { className: "w-full h-full flex flex-col mt-14", children: _jsxs("div", { id: "about", className: "w-full h-auto bg-white rounded-[30px] py-20 px-4 lg:px-9 gap-10 mx-auto", children: [_jsx("h2", { className: "text-3xl lg:text-5xl font-medium lg:leading-[75px] tracking-tighter text-[#221F28] text-center mb-20", children: "How We Make the Magic Happen" }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-3 lg:gap-0 justify-center items-center ", children: [_jsx(Step, { icon: 'paint.svg', title: _jsxs(_Fragment, { children: ["Input Your ", _jsx("br", {}), " Brand Details"] }), description: _jsxs(_Fragment, { children: ["Feed Matchpoint AI with ", _jsx("br", {}), " your brand specifics."] }) }), _jsx(Arrow, {}), _jsx(Step, { icon: 'bullseye.svg', title: _jsxs(_Fragment, { children: ["Choose Your ", _jsx("br", {}), " Campaign Goals"] }), description: _jsxs(_Fragment, { children: ["Set objectives for audience ", _jsx("br", {}), " engagement and reach."] }) }), _jsx(Arrow, {}), _jsx(Step, { icon: 'popup.svg', title: _jsxs(_Fragment, { children: ["Generate and ", _jsx("br", {}), " Publish"] }), description: _jsxs(_Fragment, { children: ["Watch as Matchpoint AI ", _jsx("br", {}), " crafts and schedules ", _jsx("br", {}), " your content."] }) })] })] }) }));
};
export default HowBanner;
//# sourceMappingURL=HowBanner.js.map