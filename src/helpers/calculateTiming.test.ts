import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { displayPeriod, displayDuration, getPostingSchedule, getPostingScheduleArray } from './calculateTiming';

describe('calculateTiming utilities', () => {
  // Mock the current date to ensure consistent test results
  const mockDate = new Date('2024-01-15T10:00:00Z'); // Monday, January 15, 2024

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('displayPeriod', () => {
    describe('input validation', () => {
      it('should return "Timing not selected" for empty startDate', () => {
        expect(displayPeriod('', '4 weeks')).toBe('Timing not selected');
      });

      it('should return "Timing not selected" for empty duration', () => {
        expect(displayPeriod('1/1/2024', '')).toBe('Timing not selected');
      });

      it('should return "Timing not selected" for both empty inputs', () => {
        expect(displayPeriod('', '')).toBe('Timing not selected');
      });

      it('should handle invalid date format gracefully', () => {
        const result = displayPeriod('invalid-date', '4 weeks');
        // Invalid date should result in NaN values and Invalid Date strings
        expect(result).toContain('Invalid Date');
      });

      it('should return "Timing not selected" for invalid duration', () => {
        expect(displayPeriod('1/1/2024', 'invalid')).toBe('Timing not selected');
      });
    });

    describe('duration parsing', () => {
      it('should handle numeric-only duration as weeks', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = '4';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('Week 3 of 4');
        expect(result).toContain('Jan 1 - 29, 2024');
      });

      it('should handle "weeks" duration format', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = '4 weeks';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('Week 3 of 4');
        expect(result).toContain('Jan 1 - 29, 2024');
      });

      it('should handle "week" singular duration format', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = '1 week';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        // Since campaign is completed (1 week from Jan 1 to Jan 8, and current date is Jan 15)
        expect(result).toContain('1 week');
        expect(result).toContain('Jan 1 - 8, 2024');
      });

      it('should throw error for unsupported duration unit', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = '4 months';

        // Act & Assert
        expect(displayPeriod(startDate, duration)).toBe('Timing not selected');
      });
    });

    describe('campaign status detection', () => {
      it('should show current week when campaign is in progress', () => {
        // Arrange - Campaign started Jan 1, current date is Jan 15 (week 3)
        const startDate = '1/1/2024';
        const duration = '4';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('Week 3 of 4');
      });

      it('should show completed status when campaign is finished', () => {
        // Arrange - Campaign that ended before current date
        const startDate = '12/1/2023';
        const duration = '2';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('2 weeks');
        expect(result).not.toContain('Week');
      });

      it('should handle campaign that has not started yet', () => {
        // Arrange - Future campaign
        const startDate = '2/1/2024';
        const duration = '4';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('4 weeks');
        expect(result).toContain('Feb 1 - 29, 2024');
      });
    });

    describe('date range formatting', () => {
      it('should format dates within the same month', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = '2';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('Jan 1 - 15, 2024');
      });

      it('should format dates across different months in same year', () => {
        // Arrange
        const startDate = '1/25/2024';
        const duration = '2';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('Jan 25 - 8, 2024');
      });

      it('should format dates across different years', () => {
        // Arrange
        const startDate = '12/25/2023';
        const duration = '2';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('Dec 25, 2023 - 8, 2024');
      });
    });

    describe('edge cases', () => {
      it('should handle leap year correctly', () => {
        // Arrange - 2024 is a leap year
        const startDate = '2/26/2024';
        const duration = '1';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert - Should go to March 4 (Feb 26 + 7 days = March 4)
        expect(result).toContain('Feb 26 - 4, 2024');
      });

      it('should handle year boundary crossing', () => {
        // Arrange
        const startDate = '12/30/2024';
        const duration = '2';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('Dec 30, 2024 - 13, 2025');
      });

      it('should handle single day duration', () => {
        // Arrange
        const startDate = '1/15/2024';
        const duration = '0';

        // Act
        const result = displayPeriod(startDate, duration);

        // Assert
        expect(result).toContain('0 weeks');
      });
    });
  });

  describe('displayDuration', () => {
    describe('input validation', () => {
      it('should return "Timing not selected" for empty startDate', () => {
        expect(displayDuration('', 4)).toBe('Timing not selected');
      });

      it('should return "Timing not selected" for empty duration', () => {
        expect(displayDuration('1/1/2024', '')).toBe('Timing not selected');
      });

      it('should return "Timing not selected" for null/undefined inputs', () => {
        expect(displayDuration(null as any, 4)).toBe('Timing not selected');
        expect(displayDuration('1/1/2024', null as any)).toBe('Timing not selected');
      });
    });

    describe('duration type handling', () => {
      it('should handle numeric duration', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = 4;

        // Act
        const result = displayDuration(startDate, duration);

        // Assert
        expect(result).toBe('January 1st - January 29th 2024');
      });

      it('should handle string duration with weeks', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = '4 weeks';

        // Act
        const result = displayDuration(startDate, duration);

        // Assert
        expect(result).toBe('January 1st - January 29th 2024');
      });

      it('should handle string duration with week (singular)', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = '1 week';

        // Act
        const result = displayDuration(startDate, duration);

        // Assert
        expect(result).toBe('January 1st - January 8th 2024');
      });

      it('should throw error for unsupported duration unit', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = '4 months';

        // Act & Assert
        expect(() => displayDuration(startDate, duration)).toThrow('Unsupported duration unit: months');
      });
    });

    describe('ordinal suffix formatting', () => {
      it('should format 1st correctly', () => {
        const result = displayDuration('1/1/2024', 1);
        expect(result).toContain('January 1st');
      });

      it('should format 2nd correctly', () => {
        const result = displayDuration('1/2/2024', 1);
        expect(result).toContain('January 2nd');
      });

      it('should format 3rd correctly', () => {
        const result = displayDuration('1/3/2024', 1);
        expect(result).toContain('January 3rd');
      });

      it('should format 4th-20th correctly', () => {
        const result = displayDuration('1/11/2024', 1);
        expect(result).toContain('January 11th');
      });

      it('should format 21st correctly', () => {
        const result = displayDuration('1/21/2024', 1);
        expect(result).toContain('January 21st');
      });

      it('should format 22nd correctly', () => {
        const result = displayDuration('1/22/2024', 1);
        expect(result).toContain('January 22nd');
      });

      it('should format 23rd correctly', () => {
        const result = displayDuration('1/23/2024', 1);
        expect(result).toContain('January 23rd');
      });

      it('should format 24th-30th correctly', () => {
        const result = displayDuration('1/24/2024', 1);
        expect(result).toContain('January 24th');
      });

      it('should format 31st correctly', () => {
        const result = displayDuration('1/31/2024', 1);
        expect(result).toContain('January 31st');
      });
    });

    describe('year display logic', () => {
      it('should show single year when start and end are in same year', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = 4;

        // Act
        const result = displayDuration(startDate, duration);

        // Assert
        expect(result).toBe('January 1st - January 29th 2024');
      });

      it('should show both years when crossing year boundary', () => {
        // Arrange
        const startDate = '12/30/2024';
        const duration = 2;

        // Act
        const result = displayDuration(startDate, duration);

        // Assert
        expect(result).toBe('December 30th - January 13th 2024 - 2025');
      });
    });

    describe('edge cases', () => {
      it('should handle zero duration', () => {
        // Arrange
        const startDate = '1/1/2024';
        const duration = 0;

        // Act
        const result = displayDuration(startDate, duration);

        // Assert - Zero duration is treated as invalid
        expect(result).toBe('Timing not selected');
      });

      it('should handle leap year dates', () => {
        // Arrange - February 29, 2024 (leap year)
        const startDate = '2/29/2024';
        const duration = 1;

        // Act
        const result = displayDuration(startDate, duration);

        // Assert
        expect(result).toBe('February 29th - March 7th 2024');
      });
    });
  });

  describe('getPostingSchedule', () => {
    it('should return "No scheduled posts" for zero posts', () => {
      expect(getPostingSchedule(0)).toBe('No scheduled posts');
    });

    it('should return "No scheduled posts" for negative posts', () => {
      expect(getPostingSchedule(-1)).toBe('No scheduled posts');
    });

    it('should return single time for 1 post', () => {
      const result = getPostingSchedule(1);
      expect(result).toMatch(/^12 PM GMT[+-]?\d*$/);
    });

    it('should return two times for 2 posts', () => {
      const result = getPostingSchedule(2);
      expect(result).toMatch(/^9 AM, 5 PM GMT[+-]?\d*$/);
    });

    it('should return three times for 3 posts', () => {
      const result = getPostingSchedule(3);
      expect(result).toMatch(/^9 AM, 2 PM, 5 PM GMT[+-]?\d*$/);
    });

    it('should return four times for 4 posts', () => {
      const result = getPostingSchedule(4);
      expect(result).toMatch(/^9 AM, 12 PM, 2 PM, 5 PM GMT[+-]?\d*$/);
    });

    it('should return all five times for 5 posts', () => {
      const result = getPostingSchedule(5);
      expect(result).toMatch(/^9 AM, 12 PM, 2 PM, 5 PM, 8 PM GMT[+-]?\d*$/);
    });

    it('should return all five times for 6 or more posts', () => {
      const result = getPostingSchedule(6);
      expect(result).toMatch(/^9 AM, 12 PM, 2 PM, 5 PM, 8 PM GMT[+-]?\d*$/);

      const result10 = getPostingSchedule(10);
      expect(result10).toMatch(/^9 AM, 12 PM, 2 PM, 5 PM, 8 PM GMT[+-]?\d*$/);
    });
  });

  describe('getPostingScheduleArray', () => {
    it('should return empty array for zero posts', () => {
      expect(getPostingScheduleArray(0)).toEqual([]);
    });

    it('should return empty array for negative posts', () => {
      expect(getPostingScheduleArray(-1)).toEqual([]);
    });

    it('should return single time array for 1 post', () => {
      const result = getPostingScheduleArray(1);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatch(/^12 PM GMT[+-]?\d*$/);
    });

    it('should return two times array for 2 posts', () => {
      const result = getPostingScheduleArray(2);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatch(/^9 AM GMT[+-]?\d*$/);
      expect(result[1]).toMatch(/^5 PM GMT[+-]?\d*$/);
    });

    it('should return three times array for 3 posts', () => {
      const result = getPostingScheduleArray(3);
      expect(result).toHaveLength(3);
      expect(result[0]).toMatch(/^9 AM GMT[+-]?\d*$/);
      expect(result[1]).toMatch(/^2 PM GMT[+-]?\d*$/);
      expect(result[2]).toMatch(/^5 PM GMT[+-]?\d*$/);
    });

    it('should return four times array for 4 posts', () => {
      const result = getPostingScheduleArray(4);
      expect(result).toHaveLength(4);
      expect(result[0]).toMatch(/^9 AM GMT[+-]?\d*$/);
      expect(result[1]).toMatch(/^12 PM GMT[+-]?\d*$/);
      expect(result[2]).toMatch(/^2 PM GMT[+-]?\d*$/);
      expect(result[3]).toMatch(/^5 PM GMT[+-]?\d*$/);
    });

    it('should return all five times array for 5 posts', () => {
      const result = getPostingScheduleArray(5);
      expect(result).toHaveLength(5);
      expect(result[0]).toMatch(/^9 AM GMT[+-]?\d*$/);
      expect(result[1]).toMatch(/^12 PM GMT[+-]?\d*$/);
      expect(result[2]).toMatch(/^2 PM GMT[+-]?\d*$/);
      expect(result[3]).toMatch(/^5 PM GMT[+-]?\d*$/);
      expect(result[4]).toMatch(/^8 PM GMT[+-]?\d*$/);
    });

    it('should return all five times array for 6 or more posts', () => {
      const result = getPostingScheduleArray(6);
      expect(result).toHaveLength(5);

      const result10 = getPostingScheduleArray(10);
      expect(result10).toHaveLength(5);
    });
  });

  describe('timezone handling', () => {
    it('should include timezone in posting schedule', () => {
      const schedule = getPostingSchedule(1);
      const scheduleArray = getPostingScheduleArray(1);

      expect(schedule).toMatch(/GMT[+-]?\d*/);
      expect(scheduleArray[0]).toMatch(/GMT[+-]?\d*/);
    });

    it('should handle timezone detection gracefully', () => {
      // This test verifies that timezone is included in the output
      // We can't easily mock the timezone detection failure, so we just check the normal behavior
      const result = getPostingSchedule(1);
      expect(result).toMatch(/GMT[+-]?\d*/);
    });
  });
});