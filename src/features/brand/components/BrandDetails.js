import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useContext } from 'react';
import { SparklesMessage } from '../../../shared/components/ui/SparklesMessage';
import BrandDetailsBlock from './BrandDetailsBlock';
import BrandMissionBlock from './BrandMissionBlock';
import { BrandContext } from '../context/BrandContext';
export default function BrandDetails() {
  var businessInfo = useContext(BrandContext).businessInfo;
  return _jsxs('div', {
    className: 'my-10',
    children: [
      _jsxs('h2', {
        className: 'text-xl font-semibold text-gray-900 mb-3',
        children: [
          'Tell us about your ',
          _jsx('span', {
            className: 'capitalize',
            children: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name,
          }),
          '\u2019s brand',
        ],
      }),
      _jsxs('p', {
        className: 'text-[14px] mb-3',
        children: [
          'Here\u2019s what Matchpoint knows about ',
          _jsx('span', {
            className: 'capitalize',
            children: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name,
          }),
          ' ',
          'so far.',
        ],
      }),
      _jsx(SparklesMessage, { children: 'Click tags to activate or deactivate them' }),
      typeof (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.mission) ===
      'string'
        ? _jsx(BrandMissionBlock, {})
        : _jsx(BrandDetailsBlock, { category: 'mission' }),
      _jsx(BrandDetailsBlock, { category: 'values' }),
      _jsx(BrandDetailsBlock, { category: 'persona' }),
      _jsx(BrandDetailsBlock, { category: 'toneAndVoice' }),
    ],
  });
}
//# sourceMappingURL=BrandDetails.js.map
