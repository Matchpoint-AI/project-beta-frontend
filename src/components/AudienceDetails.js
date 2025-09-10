import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { SparklesMessage } from '../shared/components/ui/SparklesMessage';
import EditBlock from './shared/EditBlock';
import ChipComponent from '../shared/components/ui/ChipComponent';
import ChipsEditBlock from './onboard/ChipsEditBlock';
export default function AudienceDetails(props) {
  var _a;
  var _b = useState(false),
    edit = _b[0],
    setEdit = _b[1];
  var handleChipClose = function (index) {
    var newChips = Array.from(props.values);
    newChips.splice(index, 1);
    props.setValues(newChips);
  };
  return _jsxs('div', {
    className: 'mb-5',
    children: [
      _jsxs('div', {
        className: 'flex items-center gap-3',
        children: [
          _jsx('h3', {
            title: 'email',
            className: 'block mb-2 text-xl font-medium text-gray-900',
            children: props.title,
          }),
          _jsx(EditBlock, {
            disabled: edit,
            onClick: function () {
              return setEdit(true);
            },
            className: 'ml-auto',
          }),
        ],
      }),
      props.description &&
        _jsx('p', { className: 'text-[#6B7280] text-sm mb-3', children: props.description }),
      _jsx(SparklesMessage, {
        children:
          'Matchpoint tailored these suggestions to your brand. They inform the scenes and activities shown in your content\u2014feel free to edit/add more up to 3 total',
      }),
      !edit &&
        _jsx('div', {
          className: 'bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg flex items-center mt-3',
          style: {
            height: props.values.length > 0 ? 'fit-content' : '56px',
            padding: props.values.length > 0 ? '14px 16px' : '0px 16px',
          },
          children: _jsx('div', {
            className: 'block',
            children:
              (_a = props.values) === null || _a === void 0
                ? void 0
                : _a.map(function (value, index) {
                    return _jsx(
                      ChipComponent,
                      {
                        label: value,
                        index: index,
                        selected: true,
                        onClose: handleChipClose,
                        onSelect: function () {},
                        className: 'inline-block whitespace-normal my-[2px]',
                      },
                      index
                    );
                  }),
          }),
        }),
      edit &&
        _jsx(ChipsEditBlock, {
          max: 3,
          initValues: props.values,
          saveValues: props.setValues,
          closeEdit: function () {
            return setEdit(false);
          },
          className: 'mt-3',
          genre: props.genre,
        }),
    ],
  });
}
//# sourceMappingURL=AudienceDetails.js.map
