import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useRef } from 'react';
import { CampaignContext } from '../context/CampaignContext';
import dayjs from 'dayjs';
export default function CampaignSchedule() {
  var _a;
  var campaignInfo = useContext(CampaignContext).campaignInfo;
  var startingDays = useRef(
    (function () {
      var _a;
      var days = [];
      var duration =
        (_a =
          campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.durationNum) !==
          null && _a !== void 0
          ? _a
          : 0;
      for (var i = 0; i < duration; i++) {
        var date = dayjs(
          campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.start_date
        ).add(i, 'weeks');
        var month = date.format('MMMM');
        var day = date.get('D');
        days.push(''.concat(month, ' ').concat(day));
      }
      return days;
    })()
  );
  return _jsx(_Fragment, {
    children:
      startingDays.current &&
      _jsx('div', {
        className: 'p-5 mb-[14px] rounded-md w-full bg-[#F6F5FF] border border-[#D1D5DB]',
        children: _jsxs('div', {
          children: [
            _jsx('h1', {
              className: 'capitalize text-[#42389D] font-medium text-lg leading-7 mb-1',
              children: 'Deliverables',
            }),
            _jsx('ul', {
              className: 'list-disc font-bold pl-8',
              children: Array.from({
                length:
                  (_a =
                    campaignInfo === null || campaignInfo === void 0
                      ? void 0
                      : campaignInfo.durationNum) !== null && _a !== void 0
                    ? _a
                    : 0,
              }).map(function (x, i) {
                var _a;
                return _jsxs(
                  'li',
                  {
                    children: [
                      _jsxs('span', {
                        className: 'capitalize',
                        children: ['campaign week ', i + 1],
                      }),
                      ' ',
                      _jsxs('span', {
                        className: 'font-normal',
                        children: [
                          '- ',
                          ((_a =
                            campaignInfo === null || campaignInfo === void 0
                              ? void 0
                              : campaignInfo.frequency) !== null && _a !== void 0
                            ? _a
                            : 0) * 7,
                          ' total files delivered by',
                          ' ',
                          startingDays.current[i],
                        ],
                      }),
                    ],
                  },
                  i
                );
              }),
            }),
          ],
        }),
      }),
  });
}
//# sourceMappingURL=CampaignSchedule.js.map
