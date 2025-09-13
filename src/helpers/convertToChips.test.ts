import { describe, it, expect } from 'vitest';
import convertToChipsArray, { Chip } from './convertToChips';

describe('convertToChipsArray', () => {
  describe('when input is string array', () => {
    it('should convert string array to chips with correct structure', () => {
      // Arrange
      const input = ['tag1', 'tag2', 'tag3'];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 0, label: 'tag1', selected: true },
        { id: 1, label: 'tag2', selected: true },
        { id: 2, label: 'tag3', selected: true },
      ]);
    });

    it('should handle single string in array', () => {
      // Arrange
      const input = ['single-tag'];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([{ id: 0, label: 'single-tag', selected: true }]);
    });

    it('should filter out empty strings and whitespace-only strings', () => {
      // Arrange
      const input = ['valid', '', '  ', 'also-valid', '   \t\n   '];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 0, label: 'valid', selected: true },
        { id: 1, label: 'also-valid', selected: true },
      ]);
    });

    it('should filter out null and undefined values', () => {
      // Arrange
      const input = ['valid', null as any, undefined as any, 'also-valid'];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 0, label: 'valid', selected: true },
        { id: 1, label: 'also-valid', selected: true },
      ]);
    });

    it('should filter out non-string values', () => {
      // Arrange
      const input = ['valid', 123 as any, true as any, 'also-valid', {} as any];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 0, label: 'valid', selected: true },
        { id: 1, label: 'also-valid', selected: true },
      ]);
    });

    it('should handle empty array', () => {
      // Arrange
      const input: string[] = [];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle array with only invalid values', () => {
      // Arrange
      const input = ['', '  ', null as any, undefined as any, 123 as any];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([]);
    });

    it('should preserve spaces within valid strings', () => {
      // Arrange
      const input = ['tag with spaces', 'another tag'];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 0, label: 'tag with spaces', selected: true },
        { id: 1, label: 'another tag', selected: true },
      ]);
    });
  });

  describe('when input is Chip array', () => {
    it('should preserve existing chip structure with ids', () => {
      // Arrange
      const input: Chip[] = [
        { id: 10, label: 'existing1', selected: false },
        { id: 20, label: 'existing2', selected: true },
      ];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 10, label: 'existing1', selected: false },
        { id: 20, label: 'existing2', selected: true },
      ]);
    });

    it('should add missing ids to chips that do not have them', () => {
      // Arrange
      const input = [
        { label: 'no-id-chip1', selected: true },
        { id: 5, label: 'has-id-chip', selected: false },
        { label: 'no-id-chip2', selected: true },
      ] as Chip[];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 0, label: 'no-id-chip1', selected: true },
        { id: 5, label: 'has-id-chip', selected: false },
        { id: 2, label: 'no-id-chip2', selected: true },
      ]);
    });

    it('should handle chips with id 0', () => {
      // Arrange
      const input: Chip[] = [
        { id: 0, label: 'zero-id', selected: true },
        { id: 1, label: 'one-id', selected: false },
      ];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 0, label: 'zero-id', selected: true },
        { id: 1, label: 'one-id', selected: false },
      ]);
    });

    it('should handle empty chip array', () => {
      // Arrange
      const input: Chip[] = [];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([]);
    });

    it('should preserve additional properties in chips', () => {
      // Arrange
      const input = [
        {
          id: 1,
          label: 'chip1',
          selected: true,
          customProp: 'custom',
          extraData: { nested: 'value' },
        },
      ] as Chip[];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result[0]).toMatchObject({
        id: 1,
        label: 'chip1',
        selected: true,
        customProp: 'custom',
        extraData: { nested: 'value' },
      });
    });
  });

  describe('edge cases', () => {
    it('should handle mixed array with both object and string detection correctly', () => {
      // Arrange - this test ensures proper type detection
      const stringInput = ['string1', 'string2'];
      const chipInput: Chip[] = [
        { id: 1, label: 'chip1', selected: true },
        { id: 2, label: 'chip2', selected: false },
      ];

      // Act
      const stringResult = convertToChipsArray(stringInput);
      const chipResult = convertToChipsArray(chipInput);

      // Assert
      expect(stringResult).toEqual([
        { id: 0, label: 'string1', selected: true },
        { id: 1, label: 'string2', selected: true },
      ]);
      expect(chipResult).toEqual([
        { id: 1, label: 'chip1', selected: true },
        { id: 2, label: 'chip2', selected: false },
      ]);
    });

    it('should handle array with special characters in strings', () => {
      // Arrange
      const input = ['tag@#$%', 'tag with émojis 🎉', 'tag\nwith\nnewlines'];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toEqual([
        { id: 0, label: 'tag@#$%', selected: true },
        { id: 1, label: 'tag with émojis 🎉', selected: true },
        { id: 2, label: 'tag\nwith\nnewlines', selected: true },
      ]);
    });

    it('should handle very long strings', () => {
      // Arrange
      const longString = 'a'.repeat(1000);
      const input = [longString, 'normal'];

      // Act
      const result = convertToChipsArray(input);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].label).toBe(longString);
      expect(result[1].label).toBe('normal');
    });
  });
});
