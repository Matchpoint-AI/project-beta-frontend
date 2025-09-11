import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useContext } from 'react';
import { BrandContext } from '../../features/brand/context/BrandContext';
var StepComponent = function (_a) {
  var title = _a.title,
    icon = _a.icon,
    step = _a.step,
    currentStep = _a.currentStep,
    setStep = _a.setStep;
  var businessInfo = useContext(BrandContext).businessInfo;
  var headers = ['', 'Nice name', 'Brand Guidelines are good!', "Let's Review"];
  var capitalizeFirstLetter = function (str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  var descriptions = [
    '',
    'Business info is locked. Keep going!',
    'The logo, colors and look of your brand make you recognizable and memorable',
    "Let's make sure we’ve gotten to know you well.",
  ];
  return _jsxs('button', {
    disabled: step >= currentStep,
    onClick: function () {
      return setStep(step);
    },
    className: 'flex flex-col justify-center py-4 space-y-2',
    children: [
      _jsxs('div', {
        className: 'flex items-center',
        children: [
          _jsx('div', {
            className: 'mr-2',
            children: _jsx('img', {
              src:
                currentStep === step
                  ? ''.concat(icon, '_active.svg')
                  : ''.concat(icon, '_gray.svg'),
              alt: icon,
              width: 20,
              height: 20,
            }),
          }),
          _jsx('p', {
            className: 'text-sm '.concat(
              currentStep === step && step >= currentStep
                ? 'text-[#5145CD] font-bold'
                : 'font-normal text-[#747474]'
            ),
            children: title,
          }),
        ],
      }),
      currentStep === step &&
        _jsxs('div', {
          children: [
            _jsx('div', {
              className: 'flex flex-row',
              children: _jsxs('p', {
                className: 'text-lg font-semibold text-gray-900',
                children: [
                  headers[currentStep],
                  currentStep === 1 &&
                    businessInfo.name !== undefined &&
                    businessInfo.name !== '' &&
                    _jsxs('span', {
                      className: 'text-lg font-semibold text-indigo-700',
                      children: [',', ' '.concat(capitalizeFirstLetter(businessInfo.name), '!')],
                    }),
                ],
              }),
            }),
            _jsx('p', {
              className: 'text-md font-light text-left',
              children: descriptions[currentStep],
            }),
          ],
        }),
    ],
  });
};
export default StepComponent;
//# sourceMappingURL=StepComponent.js.map
