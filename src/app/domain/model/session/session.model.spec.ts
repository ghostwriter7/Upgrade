import { describe, expect, it } from 'vitest';
import { DateHelper } from '@common/helper/date.helper';
import { Session } from './session.model';
import { bwSet } from '@test/fixtures/exercise-set.fixtures';

describe('Session', () => {
  const sessionWithExercises = (...exerciseNames: string[]) =>
    Session.createEmpty().addExerciseLogs(exerciseNames).session;

  const logMatcher = (sessionId: string, exerciseId: string, index: number) =>
    expect.objectContaining({ exerciseId, sessionId, index });

  it('should create an empty session with a unique identifier and a current date as a starting point', () => {
    const now = DateHelper.now();

    const session = Session.createEmpty();

    const diffInMs = Math.abs(now.epochMilliseconds - session.startedAt.epochMilliseconds);
    expect(session.id).toBeTypeOf('string');
    expect(diffInMs).toBeLessThan(100);
  });

  test.each([
    [DateHelper.from('2025-05-05T12:00:00Z'), 5],
    [DateHelper.from('2036-01-01T00:00:00Z'), 1],
    [DateHelper.from('1994-07-30T00:00:00Z'), 30],
  ])(
    'should return the correct day of month for session started at %s',
    (startedAt, expectedDay) => {
      const session = Session.createEmpty();
      session.startedAt = startedAt;

      expect(session.dayOfMonth).toBe(expectedDay);
    },
  );

  describe('isEmpty', () => {
    test.each([[[]], [['anyId']], [['anyId', 'anotherId']]])(
      'should return true when there are no sets',
      (exerciseIds) => {
        const session = Session.createEmpty();
        exerciseIds.forEach((exerciseId) => session.addExerciseLog(exerciseId));

        expect(session.isEmpty).toEqual(true);
      },
    );

    it('should return false when there is at least one set associated with at least one exercise', () => {
      const session = sessionWithExercises('chin-ups', 'pull-ups', 'dips');
      session.addSet(bwSet(0, 5, { sessionId: session.id, exerciseId: 'dips' }));

      expect(session.isEmpty).toEqual(false);
    });
  });

  describe('addExerciseLog', () => {
    it('should throw an exception when an exercise log for a given exercise ID already exists', () => {
      const session = sessionWithExercises('chin-ups');

      expect(() => session.addExerciseLog('chin-ups')).toThrow(
        `Exercise with ID 'chin-ups' already exists in session.`,
      );
    });

    it('should add an exercise log to an empty session', () => {
      const session = Session.createEmpty();

      const { session: updatedSession, addedLog } = session.addExerciseLog('chin-ups');

      const matcher = logMatcher(session.id, 'chin-ups', 0);
      expect(updatedSession.exerciseLogs).toEqual(expect.arrayContaining([matcher]));
      expect(updatedSession.exerciseIds).toEqual(['chin-ups']);
      expect(addedLog).toEqual(matcher);
    });

    it('should add an exercise log to a session with existing logs', () => {
      const session = sessionWithExercises('chin-ups', 'front-splits');

      const { session: updatedSession, addedLog } = session.addExerciseLog('pull-ups');

      expect(updatedSession.exerciseLogs.length).toBe(3);
      const matcher = logMatcher(session.id, 'pull-ups', 2);
      expect(updatedSession.exerciseLogs).toEqual(
        expect.arrayContaining([session.exerciseLogs[0], session.exerciseLogs[1], matcher]),
      );
      expect(updatedSession.exerciseIds).toEqual(['chin-ups', 'front-splits', 'pull-ups']);
      expect(addedLog).toEqual(matcher);
    });
  });

  describe('addExerciseLogs', () => {
    it('should throw an exception when invoked with an empty list of exercise IDs', () => {
      const session = Session.createEmpty();

      expect(() => session.addExerciseLogs([])).toThrow(
        'At least one exercise ID must be provided to add exercise logs.',
      );
    });

    it('should throw an exception when any exercise ID already exists in the session', () => {
      const session = sessionWithExercises('chin-ups', 'pull-ups');

      expect(() => session.addExerciseLogs(['front-splits', 'deadlifts', 'pull-ups'])).toThrow(
        'One or more exercise IDs already exist in the session.',
      );
    });

    it('should add multiple exercise logs to an empty session', () => {
      const session = Session.createEmpty();

      const { session: updatedSession, addedLogs } = session.addExerciseLogs([
        'chin-ups',
        'front-splits',
        'deadlifts',
      ]);

      const expectedLogs = [
        logMatcher(session.id, 'chin-ups', 0),
        logMatcher(session.id, 'front-splits', 1),
        logMatcher(session.id, 'deadlifts', 2),
      ];
      expect(updatedSession.exerciseIds).toEqual(['chin-ups', 'front-splits', 'deadlifts']);
      expect(updatedSession.exerciseLogs.length).toBe(3);
      expect(addedLogs).toEqual(expectedLogs);
      expect(updatedSession.exerciseLogs).toEqual(expectedLogs);
    });

    it('should add multiple exercise logs to a session with existing logs', () => {
      const session = sessionWithExercises('chin-ups', 'front-splits');

      const { session: updatedSession, addedLogs } = session.addExerciseLogs([
        'l-sit',
        'side-splits',
      ]);

      const expectedAddedLogs = [
        logMatcher(session.id, 'l-sit', 2),
        logMatcher(session.id, 'side-splits', 3),
      ];
      const expectedLogs = [session.exerciseLogs[0], session.exerciseLogs[1], ...expectedAddedLogs];
      expect(updatedSession.exerciseLogs.length).toBe(4);
      expect(updatedSession.exerciseIds).toEqual([
        'chin-ups',
        'front-splits',
        'l-sit',
        'side-splits',
      ]);
      expect(addedLogs).toEqual(expectedAddedLogs);
      expect(updatedSession.exerciseLogs).toEqual(expectedLogs);
    });
  });

  describe('removeExerciseLog', () => {
    it('should remove the last exercise log and perform no reindexing', () => {
      const session = sessionWithExercises('chin-ups', 'front-splits');
      const expectedSession = session.clone();
      expectedSession.exerciseLogs = [expectedSession.exerciseLogs[0]];
      expectedSession.exerciseIds = ['chin-ups'];

      const {
        removedLog,
        reIndexedLogs,
        session: updatedSession,
      } = session.removeExerciseLog('front-splits');

      expect(updatedSession).toEqual(expectedSession);
      expect(removedLog).toEqual(session.exerciseLogs[1]);
      expect(reIndexedLogs).toEqual([]);
    });

    it('should remove the first exercise log and reindex subsequent logs', () => {
      const session = sessionWithExercises('chin-ups', 'front-splits', 'l-sit', 'dips');
      const expectedSession = session.clone();
      const expectedReIndexedLogs = [
        expectedSession.exerciseLogs[1].withIndex(0),
        expectedSession.exerciseLogs[2].withIndex(1),
        expectedSession.exerciseLogs[3].withIndex(2),
      ];
      expectedSession.exerciseLogs = expectedReIndexedLogs;
      expectedSession.exerciseIds = ['front-splits', 'l-sit', 'dips'];

      const {
        removedLog,
        reIndexedLogs,
        session: updatedSession,
      } = session.removeExerciseLog('chin-ups');

      expect(updatedSession).toEqual(expectedSession);
      expect(removedLog).toEqual(session.exerciseLogs[0]);
      expect(reIndexedLogs).toEqual(expectedReIndexedLogs);
    });

    it('should remove the exercise log in the middle, reindex subsequent logs and leave prior logs unchanged', () => {
      const session = sessionWithExercises('chin-ups', 'front-splits', 'l-sit', 'dips');
      const expectedSession = session.clone();
      const expectedReIndexedLogs = [
        expectedSession.exerciseLogs[2].withIndex(1),
        expectedSession.exerciseLogs[3].withIndex(2),
      ];
      expectedSession.exerciseLogs = [session.exerciseLogs[0], ...expectedReIndexedLogs];
      expectedSession.exerciseIds = ['chin-ups', 'l-sit', 'dips'];

      const {
        removedLog,
        reIndexedLogs,
        session: updatedSession,
      } = session.removeExerciseLog('front-splits');

      expect(updatedSession).toEqual(expectedSession);
      expect(removedLog).toEqual(session.exerciseLogs[1]);
      expect(reIndexedLogs).toEqual(expectedReIndexedLogs);
    });
  });
});
