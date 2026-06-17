import { bwSet, isoSet, weightSet } from '@test/fixtures/exercise-set.fixtures';
import { compareSet } from '@domain/model/exercise-set/compare-set';

describe('compareSet', () => {
  test.each([
    {
      sets: [bwSet(0, 10), bwSet(2, 10)],
      expected: true,
    },
    { sets: [bwSet(0, 10), bwSet(0, 11)], expected: false },
    { sets: [bwSet(0, 10), weightSet(0, 10, 10)], expected: false },
    { sets: [bwSet(0, 10), isoSet(0, 10)], expected: false },
    { sets: [isoSet(0, 10), isoSet(1, 10)], expected: true },
    { sets: [isoSet(0, 10, 20), isoSet(1, 10, 20)], expected: true },
    { sets: [isoSet(0, 10), bwSet(0, 11)], expected: false },
    { sets: [isoSet(0, 10), weightSet(0, 10, 10)], expected: false },
    { sets: [isoSet(0, 10), isoSet(0, 10, 1)], expected: false },
    {
      sets: [weightSet(0, 10, 5), bwSet(0, 11)],
      expected: false,
    },
    {
      sets: [weightSet(0, 10, 11), weightSet(0, 10, 10)],
      expected: false,
    },
    {
      sets: [weightSet(0, 10, 10), isoSet(0, 10, 10)],
      expected: false,
    },
  ])('should compare 2 sets', ({ sets, expected }) =>
    expect(compareSet(sets[0], sets[1])).toBe(expected),
  );
});
