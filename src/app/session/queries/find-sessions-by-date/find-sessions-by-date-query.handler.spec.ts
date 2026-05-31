import { FindSessionsByDateQueryHandler } from '@session/queries/find-sessions-by-date/find-sessions-by-date-query.handler';
import { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '@persistence/repository/session.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { FindSessionsByDateQuery } from '@session/queries/find-sessions-by-date/find-sessions-by-date.query';
import { Session } from '@domain/model/session/session.model';
import { ExerciseLog } from '@domain/model/exercise-log.model';
import { BodyweightSet, ExerciseSet } from '@domain/model/exercise-set.model';

describe('FindSessionsByDateQueryHandler', () => {
  let sessionRepositoryMock: { findAllByDate: Mock };
  let exerciseLogRepositoryMock: { getAllLogsBySessionId: Mock };
  let setRepositoryMock: { getAllBySessionId: Mock };

  let handler: FindSessionsByDateQueryHandler;

  beforeEach(() => {
    sessionRepositoryMock = { findAllByDate: vi.fn() };
    exerciseLogRepositoryMock = { getAllLogsBySessionId: vi.fn() };
    setRepositoryMock = { getAllBySessionId: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        FindSessionsByDateQueryHandler,
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        { provide: SetRepository, useValue: setRepositoryMock },
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
      ],
    });

    handler = TestBed.inject(FindSessionsByDateQueryHandler);
  });

  const log = (sessionId: string, exerciseId: string, index: number) =>
    new ExerciseLog(sessionId, exerciseId).withIndex(index);

  const set = (sessionId: string, exerciseId: string, index: number) =>
    new BodyweightSet(sessionId, exerciseId, index, index + 1);

  const logMatcher = (sessionId: string, exerciseId: string, index: number) =>
    expect.objectContaining({
      sessionId,
      exerciseId,
      index,
    });

  const assertSessionId = (actual: Session, expected: string) => expect(actual.uuid).toBe(expected);

  const assertExerciseLogs = (
    actual: ExerciseLog[],
    expectedSessionId: string,
    ...expected: { sets: ExerciseSet[]; exerciseId: string }[]
  ) => {
    expect(actual.length).toEqual(expected.length);

    expected.forEach(({ sets, exerciseId }, index) => {
      const log = actual[index];
      expect(log.sessionId).toBe(expectedSessionId);
      expect(log.exerciseId).toBe(exerciseId);
      expect(log.sets.length).toEqual(sets.length);
      expect(log.sets).toEqual(sets.toSorted((a, b) => a.index - b.index));
    });
  };

  it('should early return if no sessions found', async () => {
    const query = new FindSessionsByDateQuery(Temporal.Now.zonedDateTimeISO('Europe/Warsaw'));

    sessionRepositoryMock.findAllByDate.mockResolvedValue([]);

    const result = await handler.query(query);

    expect(result).toEqual([]);
    expect(setRepositoryMock.getAllBySessionId).not.toHaveBeenCalled();
    expect(exerciseLogRepositoryMock.getAllLogsBySessionId).not.toHaveBeenCalled();
    expect(sessionRepositoryMock.findAllByDate).toHaveBeenCalledExactlyOnceWith(query.date);
  });

  it('should query sessions by date', async () => {
    const query = new FindSessionsByDateQuery(Temporal.Now.zonedDateTimeISO('Europe/Warsaw'));

    const sessionA = Session.createEmpty();
    const sessionB = Session.createEmpty();
    sessionRepositoryMock.findAllByDate.mockResolvedValue([sessionA, sessionB]);

    const logOneForA = log(sessionA.uuid, 'chin-ups', 2);
    const logTwoForA = log(sessionA.uuid, 'pull-ups', 0);
    const logThreeForA = log(sessionA.uuid, 'l-sit', 1);

    const logOneForB = log(sessionB.uuid, 'back-squats', 1);
    const logTwoForB = log(sessionB.uuid, 'push-ups', 0);

    exerciseLogRepositoryMock.getAllLogsBySessionId
      .mockResolvedValueOnce([logOneForA, logTwoForA, logThreeForA])
      .mockResolvedValueOnce([logOneForB, logTwoForB]);

    const chinUpSets = [1, 0, 2].map((index) => set(sessionA.uuid, 'chin-ups', index));
    const pullUpSets = [1, 0].map((index) => set(sessionA.uuid, 'pull-ups', index));
    const backSquatSets = [0, 1, 2].map((index) => set(sessionB.uuid, 'back-squats', index));
    const pushUpSets = [4, 3, 1, 0, 2].map((index) => set(sessionB.uuid, 'push-ups', index));

    setRepositoryMock.getAllBySessionId
      .mockResolvedValueOnce([...chinUpSets, ...pullUpSets])
      .mockResolvedValueOnce([...backSquatSets, ...pushUpSets]);

    const sessions = await handler.query(query);

    expect(sessionRepositoryMock.findAllByDate).toHaveBeenCalledExactlyOnceWith(query.date);

    expect(exerciseLogRepositoryMock.getAllLogsBySessionId).toHaveBeenCalledTimes(2);
    expect(exerciseLogRepositoryMock.getAllLogsBySessionId).toHaveBeenNthCalledWith(
      1,
      sessionA.uuid,
    );
    expect(exerciseLogRepositoryMock.getAllLogsBySessionId).toHaveBeenNthCalledWith(
      2,
      sessionB.uuid,
    );

    expect(setRepositoryMock.getAllBySessionId).toHaveBeenCalledTimes(2);
    expect(setRepositoryMock.getAllBySessionId).toHaveBeenNthCalledWith(1, sessionA.uuid);
    expect(setRepositoryMock.getAllBySessionId).toHaveBeenNthCalledWith(2, sessionB.uuid);

    expect(sessions.length).toBe(2);

    const [actualSessionA, actualSessionB] = sessions;
    assertSessionId(actualSessionA, sessionA.uuid);
    assertSessionId(actualSessionB, sessionB.uuid);

    assertExerciseLogs(
      actualSessionA.exercises,
      sessionA.uuid,
      { sets: pullUpSets, exerciseId: 'pull-ups' },
      { sets: [], exerciseId: 'l-sit' },
      { sets: chinUpSets, exerciseId: 'chin-ups' },
    );

    assertExerciseLogs(
      actualSessionB.exercises,
      sessionB.uuid,
      { sets: pushUpSets, exerciseId: 'push-ups' },
      { sets: backSquatSets, exerciseId: 'back-squats' },
    );
  });
});
