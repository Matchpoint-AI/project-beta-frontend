import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from 'react';
import AudienceForm from '../../../components/Forms/AudienceForm';
// import CampaignSetupCompleteDialog from "./CampaignSetupCompleteDialog";
import PurposeForm from '../../../components/Forms/PurposeForm';
import ServiceForm from '../../../components/onboard/ServiceForm';
import TimingForm from '../../../components/Forms/TimingForm';
import { CampaignContext } from '../../../context/CampaignContext';
var CustomDialog = function (_a) {
    var 
    // onClose,
    isOpen = _a.isOpen, setIsOpen = _a.setIsOpen, setTiming = _a.setTiming, 
    // setCurrentStep,
    setService = _a.setService;
    // const [step, setStep] = React.useState(1);
    var campaignInfo = useContext(CampaignContext).campaignInfo;
    var handleBack = function () {
        setIsOpen(0);
        // setCurrentStep(5);
    };
    var handleNext = function () {
        setIsOpen(0);
        // setStep(step + 1);
    };
    return (_jsx("div", { className: "fixed z-10 inset-0 overflow-y-auto", children: _jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 transition-opacity", "aria-hidden": "true", children: _jsx("div", { className: "absolute inset-0 bg-gray-500 opacity-75" }) }), _jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", "aria-hidden": "true" }), _jsxs("div", { className: "inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all w-[639px] my-10", children: [isOpen === 1 && _jsx(PurposeForm, { review: true }), isOpen === 2 && _jsx(ServiceForm, { review: true, setService: setService }), isOpen === 3 && _jsx(AudienceForm, { review: true }), isOpen === 4 && _jsx(TimingForm, { review: true, setTiming: setTiming }), (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.campaign_brief) !== true ? (_jsxs("div", { className: "flex justify-between mb-10 w-full", children: [_jsx("button", { type: "button", className: "h-12 flex items-center text-white bg-[#F98080] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2", onClick: handleBack, children: "Cancel" }), _jsx("button", { type: "button", className: "h-12 px-5 py-2.5 text-sm font-medium text-white bg-[#5145CD] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center", onClick: handleNext, children: "Save and update brief" })] })) : (_jsx("div", { className: "flex justify-end mb-10 w-full", children: _jsx("button", { type: "button", className: "h-12 px-5 py-2.5 text-sm font-medium text-white bg-[#5145CD] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center", onClick: handleBack, children: "Go Back" }) }))] })] }) }));
};
export default CustomDialog;
//# sourceMappingURL=CustomDialog.js.map