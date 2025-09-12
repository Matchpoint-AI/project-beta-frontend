import { jsx as _jsx } from "react/jsx-runtime";
var ProgressBar = function (_a) {
    var currentStep = _a.currentStep;
    // Assume there are 4 steps in total
    var totalSteps = 4;
    var corrections = [0, 27, 18, 14, 10];
    var progress = (currentStep / totalSteps) * 100 + corrections[currentStep];
    return (_jsx("div", { className: "w-2 h-[350px] bg-gray-300 relative rounded-md ", children: _jsx("div", { style: { height: "".concat(progress, "%") }, className: "w-full bg-[#5145CD] rounded-md absolute top-0" }) }));
};
export default ProgressBar;
//# sourceMappingURL=ProgressBar.js.map