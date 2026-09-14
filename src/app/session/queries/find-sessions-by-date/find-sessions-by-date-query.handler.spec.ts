import { FindSessionsByDateQueryHandler } from '@session/queries/find-sessions-by-date/find-sessions-by-date-query.handler';
import { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '@persistence/repository/session.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { FindSessionsByDateQuery } from '@session/queries/find-sessions-by-date/find-sessions-by-date.query';
import { Session } from '@domain/model/session/session.model';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { BodyweightSet, ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';
import { createNanoId } from '@common/function/create-id.function';

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

  const set = (sessionId: string, exerciseId: string, index: number): BodyweightSet => ({
    sessionId,
    exerciseId,
    index,
    id: createNanoId(),
    reps: index + 1,
    type: 'bodyweight',
  });

  const assertSessionId = (actual: Session, expected: string) => expect(actual.id).toBe(expected);

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

    const logOneForA = log(sessionA.id, 'chin-ups', 2);
    const logTwoForA = log(sessionA.id, 'pull-ups', 0);
    const logThreeForA = log(sessionA.id, 'l-sit', 1);

    const logOneForB = log(sessionB.id, 'back-squats', 1);
    const logTwoForB = log(sessionB.id, 'push-ups', 0);

    exerciseLogRepositoryMock.getAllLogsBySessionId
      .mockResolvedValueOnce([logOneForA, logTwoForA, logThreeForA])
      .mockResolvedValueOnce([logOneForB, logTwoForB]);

    const chinUpSets = [1, 0, 2].map((index) => set(sessionA.id, 'chin-ups', index));
    const pullUpSets = [1, 0].map((index) => set(sessionA.id, 'pull-ups', index));
    const backSquatSets = [0, 1, 2].map((index) => set(sessionB.id, 'back-squats', index));
    const pushUpSets = [4, 3, 1, 0, 2].map((index) => set(sessionB.id, 'push-ups', index));

    setRepositoryMock.getAllBySessionId
      .mockResolvedValueOnce([...chinUpSets, ...pullUpSets])
      .mockResolvedValueOnce([...backSquatSets, ...pushUpSets]);

    const sessions = await handler.query(query);

    expect(sessionRepositoryMock.findAllByDate).toHaveBeenCalledExactlyOnceWith(query.date);

    expect(exerciseLogRepositoryMock.getAllLogsBySessionId).toHaveBeenCalledTimes(2);
    expect(exerciseLogRepositoryMock.getAllLogsBySessionId).toHaveBeenNthCalledWith(1, sessionA.id);
    expect(exerciseLogRepositoryMock.getAllLogsBySessionId).toHaveBeenNthCalledWith(2, sessionB.id);

    expect(setRepositoryMock.getAllBySessionId).toHaveBeenCalledTimes(2);
    expect(setRepositoryMock.getAllBySessionId).toHaveBeenNthCalledWith(1, sessionA.id);
    expect(setRepositoryMock.getAllBySessionId).toHaveBeenNthCalledWith(2, sessionB.id);

    expect(sessions.length).toBe(2);

    const [actualSessionA, actualSessionB] = sessions;
    assertSessionId(actualSessionA, sessionA.id);
    assertSessionId(actualSessionB, sessionB.id);

    assertExerciseLogs(
      actualSessionA.exerciseLogs,
      sessionA.id,
      { sets: pullUpSets, exerciseId: 'pull-ups' },
      { sets: [], exerciseId: 'l-sit' },
      { sets: chinUpSets, exerciseId: 'chin-ups' },
    );

    assertExerciseLogs(
      actualSessionB.exerciseLogs,
      sessionB.id,
      { sets: pushUpSets, exerciseId: 'push-ups' },
      { sets: backSquatSets, exerciseId: 'back-squats' },
    );
  });
});
