import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';
import { bwSet, isoSet, weightSet } from '@test/fixtures/exercise-set.fixtures';

describe('ExerciseLog', () => {
  const sessionId = 'sessionId';
  const exerciseId = 'exerciseId';
  const empty = () => new ExerciseLog(sessionId, exerciseId);

  describe('isEmpty', () => {
    it('should return true when there are no sets', () => expect(empty().isEmpty).toBe(true));

    it('should return false when there are sets', () => {
      const log = empty().withSet(bwSet(0, 10));

      expect(log.isEmpty).toBe(false);
    });
  });

  describe('hasAllEqualSets', () => {
    test.each([
      [[bwSet(0, 10), bwSet(1, 10), bwSet(2, 10)]],
      [[isoSet(0, 10), isoSet(1, 10), isoSet(2, 10)]],
      [[weightSet(0, 10, 10), weightSet(1, 10, 10), weightSet(2, 10, 10)]],
    ])(
      'should return true when all sets have the same type and quantity',
      (sets: ExerciseSet[]) => {
        const log = empty().withSets(sets);

        expect(log.hasAllEqualSets()).toBe(true);
      },
    );

    it('should return true when there are no sets', () =>
      expect(empty().hasAllEqualSets()).toBe(true));

    test.each([
      [[bwSet(0, 10), bwSet(1, 10), bwSet(2, 11)]],
      [[isoSet(0, 10), isoSet(1, 10), bwSet(2, 10)]],
      [[weightSet(0, 10, 10), weightSet(1, 10, 10), weightSet(2, 10, 11)]],
    ])('should return false when sets are different', (sets) => {
      const log = empty().withSets(sets);

      expect(log.hasAllEqualSets()).toBe(false);
    });
  });

  describe('computeSetSummary', () => {
    it('should return an empty array when there are no sets', () =>
      expect(empty().computeSetSummary()).toEqual([]));

    it('should return a condensed summary when all sets are equal', () => {
      const log = empty().withSets([bwSet(0, 10), bwSet(1, 10), bwSet(2, 10)]);

      expect(log.computeSetSummary()).toEqual(['3 x 10']);
    });

    it('should return a detailed summary when sets are different', () => {
      const log = empty().withSets([bwSet(0, 10), bwSet(1, 12), bwSet(2, 13)]);

      expect(log.computeSetSummary()).toEqual(['10', '12', '13']);
    });
  });
});
