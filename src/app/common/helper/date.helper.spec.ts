import { describe, it, test } from 'vitest';
import { DateHelper } from './date.helper';

describe('DateHelper', () => {
  describe('stringifyDuration', () => {
    test.each([
      { input: 1.001, output: '00:01:00' },
      { input: 1.01, output: '00:01:01' },
      { input: 1.1, output: '00:01:10' },
      { input: 1, output: '00:01:00' },
      { input: 10, output: '00:10:00' },
      { input: 100, output: '01:40:00' },
    ])('should format duration correctly', ({ input, output }) =>
      expect(DateHelper.stringifyDuration(input)).toBe(output),
    );
  });
});
