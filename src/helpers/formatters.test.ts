import { describe, it, expect } from 'vitest';
import { capitalizeFirstLetterOfEachWord, structureData } from './formatters';

describe('formatters', () => {
  describe('capitalizeFirstLetterOfEachWord', () => {
    it('should capitalize the first letter of each word', () => {
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
      const input = 'hELLo WoRLD tESt';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('Hello World Test');
    });

    it('should handle empty string', () => {
      // Arrange
      const input = '';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      // Arrange
      const input = undefined;

      // Act
      const result = capitalizeFirstLetterOfEachWord(input as any);

      // Assert
      expect(result).toBe(undefined);
    });

    it('should handle multiple spaces between words', () => {
      // Arrange
      const input = 'hello  world   test';

      // Act
      const result = capitalizeFirstLetterOfEachWord(input);

      // Assert
      expect(result).toBe('Hello  World   Test');
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
    it('should structure simple data correctly', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            durationNum: 1,
            start_date: '2024-01-01',
            approved: true,
            post_1: {
              id: 'post1',
              text: 'First post',
              image_url: ['img1.jpg'],
              image_prompt: 'prompt1',
              platform: 'instagram',
              approved: true,
              posted: false,
            },
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0]).toMatchObject({
        durationNum: 1,
        start_date: '2024-01-01',
        approved: true,
        dayIndex: 1,
        posts: [
          expect.objectContaining({
            id: 'post1',
            text: 'First post',
            platform: 'instagram',
            postIndex: 1,
            approved: true,
            posted: false,
          }),
        ],
      });
    });

    it('should sort weeks and days correctly', () => {
      // Arrange
      const input = {
        week_2: {
          day_2: { durationNum: 2, start_date: '2024-01-02', approved: false },
          day_1: { durationNum: 1, start_date: '2024-01-01', approved: true },
        },
        week_1: {
          day_1: { durationNum: 1, start_date: '2023-12-31', approved: false },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result).toHaveLength(2);
      // First week should be week_1
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].start_date).toBe('2023-12-31');
      // Second week should be week_2 with day_1 before day_2
      expect(result[1]).toHaveLength(2);
      expect(result[1][0].start_date).toBe('2024-01-01');
      expect(result[1][1].start_date).toBe('2024-01-02');
    });

    it('should sort posts correctly', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            durationNum: 1,
            start_date: '2024-01-01',
            approved: true,
            post_3: { id: 'post3', text: 'Third post', approved: false, posted: true },
            post_1: { id: 'post1', text: 'First post', approved: true, posted: false },
            post_2: { id: 'post2', text: 'Second post', approved: false, posted: false },
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0].posts).toHaveLength(3);
      expect(result[0][0].posts[0]).toMatchObject({
        id: 'post1',
        text: 'First post',
        postIndex: 1,
        approved: true,
        posted: false,
      });
      expect(result[0][0].posts[1]).toMatchObject({
        id: 'post2',
        text: 'Second post',
        postIndex: 2,
        approved: false,
        posted: false,
      });
      expect(result[0][0].posts[2]).toMatchObject({
        id: 'post3',
        text: 'Third post',
        postIndex: 3,
        approved: false,
        posted: true,
      });
    });

    it('should handle invalid day data', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: null,
          day_2: 'invalid string',
          day_3: 123,
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0]).toHaveLength(3);
      expect(result[0][0]).toMatchObject({
        durationNum: 0,
        start_date: '',
        approved: false,
        posts: [],
        dayIndex: 1,
      });
      expect(result[0][1]).toMatchObject({
        durationNum: 0,
        start_date: '',
        approved: false,
        posts: [],
        dayIndex: 2,
      });
      expect(result[0][2]).toMatchObject({
        durationNum: 0,
        start_date: '',
        approved: false,
        posts: [],
        dayIndex: 3,
      });
    });

    it('should handle missing day properties', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {},
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0]).toMatchObject({
        durationNum: 0,
        start_date: '',
        approved: false,
        posts: [],
        dayIndex: 1,
      });
    });

    it('should filter only post keys', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            durationNum: 1,
            start_date: '2024-01-01',
            approved: true,
            post_1: { id: 'post1', text: 'Valid post' },
            not_a_post: { id: 'not_post', text: 'Should be ignored' },
            random_key: 'random value',
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0].posts).toHaveLength(1);
      expect(result[0][0].posts[0]).toMatchObject({
        id: 'post1',
        text: 'Valid post',
        postIndex: 1,
      });
    });

    it('should handle invalid post data', () => {
      // Arrange
      const input = {
        week_1: {
          day_1: {
            durationNum: 1,
            start_date: '2024-01-01',
            approved: true,
            post_1: null,
            post_2: 'invalid',
            post_3: { id: 'post3', text: 'Valid post' },
          },
        },
      };

      // Act
      const result = structureData(input);

      // Assert
      expect(result[0][0].posts).toHaveLength(3);
      expect(result[0][0].posts[0]).toMatchObject({
        postIndex: 1,
        approved: false,
        posted: false,
      });
      expect(result[0][0].posts[1]).toMatchObject({
        postIndex: 2,
        approved: false,
        posted: false,
      });
      expect(result[0][0].posts[2]).toMatchObject({
        id: 'post3',
        text: 'Valid post',
        postIndex: 3,
        approved: false,
        posted: false,
      });
    });

    it('should handle empty input', () => {
      // Arrange
      const input = {};

      // Act
      const result = structureData(input);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
