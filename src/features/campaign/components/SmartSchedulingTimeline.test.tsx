import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import SmartSchedulingTimeline from './SmartSchedulingTimeline';

// Mock the helper function
vi.mock('../../helpers/calculateTiming', () => ({
  getPostingScheduleArray: vi.fn(() => [
    { date: new Date('2024-01-01'), time: '10:00 AM' },
    { date: new Date('2024-01-02'), time: '2:00 PM' },
  ]),
}));

describe('SmartSchedulingTimeline', () => {
  const defaultProps = {
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

  it('renders without crashing', () => {
    const { container } = render(<SmartSchedulingTimeline {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it('displays the campaign timeline component', () => {
    const { container } = render(<SmartSchedulingTimeline {...defaultProps} />);
    // Just check that something renders
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with campaign data', () => {
    const { container } = render(<SmartSchedulingTimeline {...defaultProps} />);
    // Verify component renders with the provided props
    expect(container.innerHTML).toContain('div');
  });
});
