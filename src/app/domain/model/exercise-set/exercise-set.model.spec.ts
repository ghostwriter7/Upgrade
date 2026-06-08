import { bwSet, isoSet, weightSet } from '@test/fixtures/exercise-set.fixtures';

describe('ExerciseSet', () => {
  describe('BodyweightSet', () => {
    describe('isEqual', () => {
      it('should return true when the other set is the same', () => {
        const setA = bwSet(0, 10);
        const setB = bwSet(2, 10);

        expect(setA.isEqual(setB)).toBe(true);
      });

      test.each([
        [[bwSet(0, 10), bwSet(0, 11)]],
        [[bwSet(0, 10), weightSet(0, 10, 10)]],
        [[bwSet(0, 10), isoSet(0, 10)]],
      ])('should return false when the other set is different', ([setA, setB]) => {
        expect(setA.isEqual(setB)).toBe(false);
      });
    });
  });

  describe('IsoSet', () => {
    describe('isEqual', () => {
      test.each([[[isoSet(0, 10), isoSet(1, 10)]], [[isoSet(0, 10, 20), isoSet(1, 10, 20)]]])(
        'should return true when the other set is the same',
        ([setA, setB]) => {
          expect(setA.isEqual(setB)).toBe(true);
        },
      );

      test.each([
        [[isoSet(0, 10), bwSet(0, 11)]],
        [[isoSet(0, 10), weightSet(0, 10, 10)]],
        [[isoSet(0, 10), isoSet(0, 10, 1)]],
      ])('should return false when the other set is different', ([setA, setB]) => {
        expect(setA.isEqual(setB)).toBe(false);
      });
    });
  });

  describe('WeightedSet', () => {
    describe('isEqual', () => {
      it('should return true when the other set is the same', () => {
        const setA = weightSet(0, 10, 10);
        const setB = weightSet(2, 10, 10);

        expect(setA.isEqual(setB)).toBe(true);
      });

      test.each([
        [[weightSet(0, 10, 5), bwSet(0, 11)]],
        [[weightSet(0, 10, 11), weightSet(0, 10, 10)]],
        [[weightSet(0, 10, 10), isoSet(0, 10, 10)]],
      ])('should return false when the other set is different', ([setA, setB]) => {
        expect(setA.isEqual(setB)).toBe(false);
      });
    });
  });
});
