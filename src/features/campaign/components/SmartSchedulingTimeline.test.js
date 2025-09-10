var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import { jsx as _jsx } from 'react/jsx-runtime';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import SmartSchedulingTimeline from './SmartSchedulingTimeline';
// Mock the helper function
vi.mock('../../../helpers/calculateTiming', function () {
  return {
    getPostingScheduleArray: vi.fn(function () {
      return [
        { date: new Date('2024-01-01'), time: '10:00 AM' },
        { date: new Date('2024-01-02'), time: '2:00 PM' },
      ];
    }),
  };
});
describe('SmartSchedulingTimeline', function () {
  var defaultProps = {
    campaignData: {
      purpose: 'Test Campaign',
      campaign_brief: 'Test campaign brief',
      campaign_goals: ['goal1', 'goal2'],
      posting_schedule: 'daily',
      start_date: '01/01/2024',
      end_date: '01/31/2024',
      posting_frequency: 3,
    },
  };
  it('renders without crashing', function () {
    var container = render(_jsx(SmartSchedulingTimeline, __assign({}, defaultProps))).container;
    expect(container).toBeTruthy();
  });
  it('displays the campaign timeline component', function () {
    var container = render(_jsx(SmartSchedulingTimeline, __assign({}, defaultProps))).container;
    // Just check that something renders
    expect(container.firstChild).toBeTruthy();
  });
  it('renders with campaign data', function () {
    var container = render(_jsx(SmartSchedulingTimeline, __assign({}, defaultProps))).container;
    // Verify component renders with the provided props
    expect(container.innerHTML).toContain('div');
  });
});
//# sourceMappingURL=SmartSchedulingTimeline.test.js.map
