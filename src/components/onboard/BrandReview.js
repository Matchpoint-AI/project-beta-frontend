import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useContext } from 'react';
import FormsContainer from '../shared/FormsContainer';
import BrandDetailsReview from '../BrandDetailsReview';
import { BrandContext } from '../../context/BrandContext';
import Sidebar from '../shared/Sidebar';
import { FaEdit } from 'react-icons/fa';
export default function BrandReview(_a) {
  var _b, _c, _d;
  var toggleEdit = _a.toggleEdit,
    hasBrand = _a.hasBrand;
  var businessInfo = useContext(BrandContext).businessInfo;
  return _jsxs('div', {
    className: 'flex h-full flex-col max-w-2xl mx-auto gap-2 md:mt-auto mt-16',
    children: [
      _jsx(Sidebar, { currentStep: 0 }),
      _jsxs(FormsContainer, {
        children: [
          _jsxs('div', {
            className: 'flex flex-col gap-4',
            children: [
              _jsxs('button', {
                onClick: toggleEdit,
                className:
                  'flex items-center justify-center gap-2 bg-indigo-500 text-white \n            rounded-md text-sm font-medium px-4 py-1.5 \n            hover:bg-indigo-600\n            max-w-[12vw]\n            ml-auto\n            ',
                children: [_jsx(FaEdit, {}), 'Edit details'],
              }),
              _jsx('p', {
                className: 'text-xl text-[#111928] font-semibold mb-5',
                children: "Here's what Matchpoint knows about your business:",
              }),
            ],
          }),
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.logo) !== '' &&
            _jsxs('div', {
              className: 'mb-5',
              children: [
                _jsx('div', {
                  className: 'mb-5 flex items-center gap-3',
                  children: _jsx('label', {
                    title: 'logo',
                    className: 'block text-base font-medium text-gray-900',
                    children:
                      (businessInfo === null || businessInfo === void 0
                        ? void 0
                        : businessInfo.logo) !== ''
                        ? 'Logo'
                        : 'Brand Name',
                  }),
                }),
                (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.logo) !==
                ''
                  ? _jsx('img', {
                      src: 'https://storage.googleapis.com/matchpoint-brands-logos/'.concat(
                        businessInfo === null || businessInfo === void 0
                          ? void 0
                          : businessInfo.logo
                      ),
                      alt: 'logo',
                      className: 'w-[150px] h-auto',
                    })
                  : _jsx('h2', {
                      className: 'text-lg capitalize text-[#111928]',
                      children:
                        businessInfo === null || businessInfo === void 0
                          ? void 0
                          : businessInfo.name,
                    }),
              ],
            }),
          ((_c =
            (_b =
              businessInfo === null || businessInfo === void 0
                ? void 0
                : businessInfo.brandColors) === null || _b === void 0
              ? void 0
              : _b.length) !== null && _c !== void 0
            ? _c
            : 0) > 0 &&
            _jsxs('div', {
              className: 'mb-5',
              children: [
                _jsx('div', {
                  className: 'mb-5 flex items-center gap-3',
                  children: _jsx('label', {
                    className: 'block text-base font-medium text-gray-900',
                    children: 'Brand Colors',
                  }),
                }),
                _jsx('div', {
                  className: 'gap-3 overflow-x-auto whitespace-nowrap',
                  children:
                    (_d =
                      businessInfo === null || businessInfo === void 0
                        ? void 0
                        : businessInfo.brandColors) === null || _d === void 0
                      ? void 0
                      : _d.map(function (color, index) {
                          return _jsx(
                            'div',
                            {
                              className: 'w-10 h-10 rounded-full inline-block mr-2 shadow-md',
                              style: { backgroundColor: color },
                            },
                            index
                          );
                        }),
                }),
              ],
            }),
          _jsxs('div', {
            children: [
              _jsx('label', {
                title: 'logo',
                className: 'block text-base font-medium text-gray-900',
                children: 'Business and Brand Summary',
              }),
              _jsx('div', {
                className: 'bg-[#EBF5FF] p-4 my-5 rounded-md',
                children: _jsx('p', {
                  children:
                    businessInfo === null || businessInfo === void 0
                      ? void 0
                      : businessInfo.summary,
                }),
              }),
            ],
          }),
          _jsx(BrandDetailsReview, { edit: true, hasBrand: hasBrand }),
        ],
      }),
    ],
  });
}
//# sourceMappingURL=BrandReview.js.map
