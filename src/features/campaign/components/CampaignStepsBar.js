import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef } from 'react';
import StepCampaignComponent from './StepComponentCampaign';
import PhoneNavIcons from '../../../components/shared/PhoneNavIcons';
export default function CampaignStepsBar(_a) {
    var currentStep = _a.currentStep, campaignInfo = _a.campaignInfo, timing = _a.timing, service = _a.service;
    var stepTitle = useRef([
        'Campaign Creation',
        'Purpose',
        'Service of Product',
        'Audience',
        'Timing',
        'Review & Approve Brief',
    ]).current;
    var getTimingDisplay = function () {
        if (!timing || timing.includes('Invalid Date') || timing === 'Timing not selected') {
            return 'Timing not set';
        }
        var timingCleaned = timing.replace(/\b(\d+)\s+weeks?\b/gi, function (_, num) {
            var n = Number(num);
            return "".concat(n, " ").concat(n === 1 ? 'week' : 'weeks');
        });
        timingCleaned = timingCleaned.replace(/\b(week|weeks)\s+(week|weeks)\b/gi, '$1');
        return timingCleaned;
    };
    var getServiceDisplay = function () {
        if (!service || service.trim() === 'not selected' || service.trim() === '') {
            return 'Not selected yet';
        }
        return service;
    };
    var timingDisplay = getTimingDisplay();
    var serviceDisplay = getServiceDisplay();
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "hidden lg:flex flex-col w-fit mt-28 ".concat(currentStep === 6 ? 'blur-md' : ''), children: _jsxs("div", { className: "text-[#747474] w-[350px]", children: [_jsx("h1", { className: "text-[#42389D] text-lg font-semibold leading-6 capitalize", children: !campaignInfo.name || campaignInfo.name === '' ? 'campaign name' : campaignInfo.name }), _jsxs("p", { className: "text-sm", children: [_jsx("span", { className: "font-bold", children: "Brand/Service/Product: " }), serviceDisplay, " | ", timingDisplay] }), _jsxs("div", { className: "flex flex-col gap-4 my-10", children: [_jsxs("div", { className: "flex", children: [_jsx("div", { className: "mr-2", children: _jsx("img", { src: "/calendar_active.svg", alt: "calendar", width: 20, height: 20 }) }), _jsx("p", { className: "text-lg font-semibold text-[#5145CD]", children: "Campaign Creation" })] }), _jsx(StepCampaignComponent, { name: "Purpose", title: "Naming your campaign", description: "This will help you find and manage your campaign in the future.", isActive: currentStep === 1, currentStep: 1, globalStep: currentStep }), _jsx(StepCampaignComponent, { name: "Service or Product", isActive: currentStep === 2, currentStep: 2, globalStep: currentStep }), _jsx(StepCampaignComponent, { name: "Audience", isActive: currentStep === 3, currentStep: 3, globalStep: currentStep }), _jsx(StepCampaignComponent, { name: "Timing", isActive: currentStep === 4, currentStep: 4, globalStep: currentStep }), _jsx(StepCampaignComponent, { name: "Review & Approve Brief", isActive: currentStep === 5, currentStep: 5, globalStep: currentStep })] })] }) }), _jsxs("div", { className: "lg:mt-28 mt-[100px] lg:hidden block w-full", children: [_jsxs("div", { className: "mb-3 lg:mb-0", children: [_jsx("h1", { className: "bg-gradient-to-r bg-clip-text font-semibold text-transparent from-[#681DBA] to-[#FF43E1] text-2xl mb-1", children: !campaignInfo.name || campaignInfo.name === '' ? 'Campaign name' : campaignInfo.name }), _jsxs("div", { className: "text-sm", children: [_jsxs("span", { className: "font-bold", children: ["Service: ", serviceDisplay, " | "] }), _jsx("span", { children: timingDisplay })] })] }), _jsx(PhoneNavIcons, { currentStep: currentStep }), _jsx("div", { className: "mt-5", children: _jsx("span", { className: "font-semibold text-[#5145CD]", children: stepTitle[currentStep - 1] }) })] })] }));
}
//# sourceMappingURL=CampaignStepsBar.js.map