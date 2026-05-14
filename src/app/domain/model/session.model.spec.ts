import { describe, expect, it, vi} from 'vitest'
import { DateHelper } from '../../common/helper/date.helper';
import { ExerciseEntry, Session } from './session.model';
import { BodyweightSet } from './exercise-set.model';

describe('Session', () => {
  it('should create an empty session with a unique identifier and a current date as a starting point', () => {
    const now = DateHelper.now();

    const session = Session.createEmpty();

    const diffInMs = Math.abs(now.epochMilliseconds - session.startedAt.epochMilliseconds);
    expect(session.uuid).toBeTypeOf('string');
    expect(diffInMs).toBeLessThan(100);
  });

  test.each([
    [DateHelper.from('2025-05-05T12:00:00Z'), 5],
    [DateHelper.from('2036-01-01T00:00:00Z'), 1],
    [DateHelper.from('1994-07-30T00:00:00Z'), 30],
  ])('should return the correct day of month for session started at %s', (startedAt, expectedDay) => {
    const session = Session.createEmpty();
    session.startedAt = startedAt;

    expect(session.dayOfMonth).toBe(expectedDay);
  });

  describe('isEmpty', () => {
    test.each([[[]], [['anyId']], [['anyId', 'anotherId']]])(
      'should return true when there are no sets',
      (exerciseIds) => {
        const session = Session.createEmpty();
        exerciseIds.forEach((exerciseId) => session.addExerciseEntry(exerciseId));

        expect(session.isEmpty).toEqual(true);
      },
    );

    it('should return false when there is at least one set associated with at least one exercise', () => {
      const session = Session.createEmpty();
      session.addExerciseEntry('A');
      session.addExerciseEntry('B');
      session.addExerciseEntry('C');
      session.addSet('C', new BodyweightSet(5));

      expect(session.isEmpty).toEqual(false);
    });
  });
})
