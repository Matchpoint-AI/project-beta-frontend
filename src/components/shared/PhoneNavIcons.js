import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function PhoneNavIcons(_a) {
    var currentStep = _a.currentStep;
    return (_jsxs("div", { className: "flex justify-between items-center gap-2", children: [_jsx("img", { src: currentStep >= 1 ? "briefcase_active.svg" : "briefcase_gray.svg", alt: "briefcase", width: 25, height: 25 }), _jsx("div", { className: "h-[3px] w-1/5", style: {
                    backgroundColor: "".concat(currentStep >= 2 ? '#5145CD' : '#7c8092'),
                } }), _jsx("img", { src: currentStep >= 2 ? "palette_active.svg" : "palette_gray.svg", alt: "palette", width: 25, height: 25 }), _jsx("div", { className: "h-[3px] w-1/5", style: {
                    backgroundColor: "".concat(currentStep >= 3 ? '#5145CD' : '#7c8092'),
                } }), _jsx("img", { src: currentStep >= 3 ? "clipboard_active.svg" : "clipboard_gray.svg", alt: "clipboard", width: 25, height: 25 }), _jsx("div", { className: "h-[3px] w-1/5", style: {
                    backgroundColor: "".concat(currentStep >= 4 ? '#5145CD' : '#7c8092'),
                } }), _jsx("img", { src: currentStep >= 4 ? "calendar_active.svg" : "calendar_gray.svg", alt: "calendar", width: 25, height: 25 })] }));
}
//# sourceMappingURL=PhoneNavIcons.js.map