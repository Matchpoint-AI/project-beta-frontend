import { describe, it, expect } from 'vitest';
import { capitalizeFirstLetterOfEachWord, structureData } from './formatters';

describe('formatters', () => {
  describe('capitalizeFirstLetterOfEachWord', () => {
    it('should capitalize first letter of each word', () => {
      // Arrange
      const input = 'hello world test';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('Hello World Test');
    });

    it('should handle single word', () => {
      // Arrange
      const input = 'hello';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('Hello');
    });

    it('should handle mixed case input', () => {
      // Arrange
      const input = 'hELLo WoRLd';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('Hello World');
    });

    it('should return undefined for undefined input', () => {
      // Arrange
      const input = undefined as any;

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle empty string', () => {
      // Arrange
      const input = '';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('');
    });

    it('should handle strings with multiple spaces', () => {
      // Arrange
      const input = 'hello   world   test';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('Hello   World   Test');
    });

    it('should handle strings with numbers', () => {
      // Arrange
      const input = 'test 123 case';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('Test 123 Case');
    });

    it('should handle single character words', () => {
      // Arrange
      const input = 'a b c d';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('A B C D');
    });
  });

  describe('structureData', () => {
    it('should structure data with multiple weeks and days', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            durationNum: 7,
            start_date: '2024-01-01',
            approved: true,
            post_1: {
              id: 'post1',
              text: 'Test post 1',
              image_url: ['url1'],
              image_prompt: 'prompt1',
              platform: 'instagram',
              approved: true,
              posted: false,
            },
            post_2: {
              id: 'post2',
              text: 'Test post 2',
              image_url: ['url2'],
              image_prompt: 'prompt2',
              platform: 'facebook',
              approved: false,
              posted: true,
            },
          },
          day_2: {
            durationNum: 7,
            start_date: '2024-01-02',
            approved: false,
            post_1: {
              id: 'post3',
              text: 'Test post 3',
              image_url: ['url3'],
              image_prompt: 'prompt3',
              platform: 'twitter',
              approved: true,
              posted: true,
            },
          },
        },
        week_2: {
          day_1: {
            durationNum: 7,
            start_date: '2024-01-08',
            approved: true,
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2);
      expect(result[0][0].dayIndex).toBe(1);
      expect(result[0][0].start_date).toBe('2024-01-01');
      expect(result[0][0].posts).toHaveLength(2);
      expect(result[0][0].posts[0].postIndex).toBe(1);
      expect(result[0][0].posts[0].text).toBe('Test post 1');
      expect(result[0][0].posts[1].postIndex).toBe(2);
      expect(result[0][1].dayIndex).toBe(2);
      expect(result[1]).toHaveLength(1);
    });

    it('should handle empty input', () => {
      // Arrange
      const input = {};

      // Act
      const result = structureData(input);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle days without posts', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            durationNum: 7,
            start_date: '2024-01-01',
            approved: true,
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0].posts).toEqual([]);
    });

    it('should handle invalid day data gracefully', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: null,
          day_2: 'invalid',
          day_3: 123,
        },
      };

      // Act
      const result = structureData(input as any);

      // Assert
      expect(result[0]).toHaveLength(3);
      expect(result[0][0].durationNum).toBe(0);
      expect(result[0][0].start_date).toBe('');
      expect(result[0][0].approved).toBe(false);
      expect(result[0][0].posts).toEqual([]);
    });

    it('should sort weeks and days correctly', () => {
      // Arrange
      const input = {
        week_3: { day_2: { durationNum: 1 } },
        week_1: { day_3: { durationNum: 2 } },
        week_2: { day_1: { durationNum: 3 } },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0][0].durationNum).toBe(2); // week_1, day_3
      expect(result[1][0].durationNum).toBe(3); // week_2, day_1
      expect(result[2][0].durationNum).toBe(1); // week_3, day_2
    });

    it('should sort posts within days correctly', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            post_3: { id: 'p3', text: 'Third' },
            post_1: { id: 'p1', text: 'First' },
            post_2: { id: 'p2', text: 'Second' },
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0].posts[0].text).toBe('First');
      expect(result[0][0].posts[0].postIndex).toBe(1);
      expect(result[0][0].posts[1].text).toBe('Second');
      expect(result[0][0].posts[1].postIndex).toBe(2);
      expect(result[0][0].posts[2].text).toBe('Third');
      expect(result[0][0].posts[2].postIndex).toBe(3);
    });

    it('should handle missing properties with defaults', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            // Missing durationNum, start_date, approved
            post_1: {
              id: 'post1',
              text: 'Test',
              // Missing approved and posted
            },
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0].durationNum).toBe(0);
      expect(result[0][0].start_date).toBe('');
      expect(result[0][0].approved).toBe(false);
      expect(result[0][0].posts[0].approved).toBe(false);
      expect(result[0][0].posts[0].posted).toBe(false);
    });

    it('should preserve additional properties in posts', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            post_1: {
              id: 'post1',
              text: 'Test',
              customField: 'customValue',
              extraData: { nested: 'value' },
            },
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0].posts[0]).toMatchObject({
        id: 'post1',
        text: 'Test',
        customField: 'customValue',
        extraData: { nested: 'value' },
        postIndex: 1,
      });
    });

    it('should filter out non-post properties from days', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            durationNum: 7,
            start_date: '2024-01-01',
            approved: true,
            someOtherProperty: 'value',
            post_1: { id: 'p1', text: 'Post 1' },
            not_a_post: { id: 'not', text: 'Not a post' },
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0].posts).toHaveLength(1);
      expect(result[0][0].posts[0].text).toBe('Post 1');
    });

    it('should handle post data that is not an object', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            post_1: 'string value',
            post_2: 123,
            post_3: null,
            post_4: { id: 'valid', text: 'Valid post' },
          },
        },
      };

      // Act
      const result = structureData(input as any);

      // Assert
      expect(result[0][0].posts).toHaveLength(4);
      expect(result[0][0].posts[0]).toEqual({
        postIndex: 1,
        approved: false,
        posted: false,
      });
      expect(result[0][0].posts[3].text).toBe('Valid post');
    });
  });
});