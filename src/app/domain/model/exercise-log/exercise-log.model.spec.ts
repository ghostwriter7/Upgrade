import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { BodyweightSet, ExerciseSet, IsoSet, WeightedSet } from '@domain/model/exercise-set.model';

describe('ExerciseLog', () => {
  const sessionId = 'sessionId';
  const exerciseId = 'exerciseId';
  const empty = () => new ExerciseLog(sessionId, exerciseId);
  const bwSet = (index: number, reps: number) =>
    new BodyweightSet(sessionId, exerciseId, index, reps);
  const isoSet = (index: number, reps: number) => new IsoSet(sessionId, exerciseId, index, reps);
  const wSet = (index: number, reps: number, weight: number) =>
    new WeightedSet(sessionId, exerciseId, index, reps, weight);

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
      [[wSet(0, 10, 10), wSet(1, 10, 10), wSet(2, 10, 10)]],
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
      [[wSet(0, 10, 10), wSet(1, 10, 10), wSet(2, 10, 11)]],
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
