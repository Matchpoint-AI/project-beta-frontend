import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import PhoneNavIcons from '../shared/PhoneNavIcons';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import StepComponent from './StepComponent';
import { useEffect } from 'react';
export default function OnboardStepsBar(_a) {
  var currentStep = _a.currentStep,
    setStep = _a.setStep;
  var headers = ['', 'Nice name', 'Brand Guidelines are good!', "Let's Review"];
  var descriptions = [
    '',
    'Business info is locked. Keep going!',
    'The logo, colors and look of your brand make you recognizable and memorable',
    "Let's make sure we’ve gotten to know you well",
  ];
  return _jsxs(_Fragment, {
    children: [
      _jsx('div', {
        className: 'hidden lg:flex flex-col w-fit mt-28 '.concat(
          currentStep === 5 ? 'blur-md' : ''
        ),
        children: _jsx('div', {
          className: 'text-[#747474] w-[350px]',
          children: _jsxs('div', {
            className: 'flex gap-6',
            children: [
              _jsx(ProgressBar, { currentStep: currentStep }),
              _jsxs('div', {
                className: 'flex flex-col divide-[#D1D5DB] divide-y',
                children: [
                  _jsx(StepComponent, {
                    title: 'Business Info',
                    icon: 'briefcase',
                    currentStep: currentStep,
                    step: 1,
                    setStep: setStep,
                  }),
                  _jsx(StepComponent, {
                    title: 'Brand Info',
                    icon: 'palette',
                    currentStep: currentStep,
                    step: 2,
                    setStep: setStep,
                  }),
                  _jsx(StepComponent, {
                    title: 'Review',
                    icon: 'clipboard',
                    currentStep: currentStep,
                    step: 3,
                    setStep: setStep,
                  }),
                  _jsx(StepComponent, {
                    title: 'Start Campaign',
                    icon: 'calendar',
                    currentStep: currentStep,
                    step: 4,
                    setStep: setStep,
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
      _jsxs('div', {
        className: 'lg:mt-28 mt-[100px] lg:hidden block w-full',
        children: [
          _jsx(PhoneNavIcons, { currentStep: currentStep }),
          _jsxs('div', {
            className: 'mt-5',
            children: [
              _jsx('h2', {
                className: 'text-lg font-semibold text-gray-900',
                children: headers[currentStep],
              }),
              _jsx('p', { className: '', children: descriptions[currentStep] }),
            ],
          }),
        ],
      }),
    ],
  });
}
//# sourceMappingURL=OnboardStepsBar.js.map
