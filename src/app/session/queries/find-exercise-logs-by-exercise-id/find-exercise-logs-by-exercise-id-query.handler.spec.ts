import { FindExerciseLogsByExerciseIdQueryHandler } from '@session/queries/find-exercise-logs-by-exercise-id/find-exercise-logs-by-exercise-id-query.handler';
import { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { FindExerciseLogsByExerciseIdQuery } from '@session/queries/find-exercise-logs-by-exercise-id/find-exercise-logs-by-exercise-id.query';
import { log } from '@test/fixtures/exercise-log.fixtures';
import { bwSet } from '@test/fixtures/exercise-set.fixtures';

describe('FindExerciseLogsByExerciseIdQueryHandler', () => {
  let handler: FindExerciseLogsByExerciseIdQueryHandler;
  let exerciseLogRepositoryMock: {
    getAllLogsByExerciseId: Mock;
  };

  let setRepositoryMock: {
    getAllBeExerciseId: Mock;
  };

  beforeEach(() => {
    exerciseLogRepositoryMock = {
      getAllLogsByExerciseId: vi.fn(),
    };

    setRepositoryMock = {
      getAllBeExerciseId: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        { provide: SetRepository, useValue: setRepositoryMock },
        FindExerciseLogsByExerciseIdQueryHandler,
      ],
    });

    handler = TestBed.inject(FindExerciseLogsByExerciseIdQueryHandler);
  });

  const exerciseId = 'pull-ups';
  const query = new FindExerciseLogsByExerciseIdQuery(exerciseId);

  it('should return an empty list where there are no sets and logs for a given exercise ID', async () => {
    exerciseLogRepositoryMock.getAllLogsByExerciseId.mockResolvedValue([]);
    setRepositoryMock.getAllBeExerciseId.mockResolvedValue([]);

    const result = await handler.query(query);

    expect(result).toEqual([]);
    expect(exerciseLogRepositoryMock.getAllLogsByExerciseId).toHaveBeenCalledExactlyOnceWith(
      exerciseId,
    );
    expect(setRepositoryMock.getAllBeExerciseId).toHaveBeenCalledExactlyOnceWith(exerciseId);
  });

  const logMatcher = (id: string, sessionId: string, ...reps: number[]) =>
    expect.objectContaining({
      id,
      sessionId,
      sets: expect.arrayContaining(
        reps.map((reps, index) => expect.objectContaining({ type: 'bodyweight', index, reps })),
      ),
    });

  it('should return exercise logs (sorted by created at in descending order) with populated sets (sorted by index)', async () => {
    const logs = [
      log({ createdAt: Temporal.Instant.from('2026-06-26T10:00:00Z') }),
      log({ createdAt: Temporal.Instant.from('2026-07-07T15:00:00Z') }),
      log({ createdAt: Temporal.Instant.from('2026-07-07T09:00:00Z') }),
    ];
    const [sessionA, sessionB, sessionC] = logs.map(({ sessionId }) => sessionId);
    const sets = [
      bwSet(1, 10, { sessionId: sessionA, exerciseId }),
      bwSet(0, 8, { sessionId: sessionA, exerciseId }),
      bwSet(0, 3, { sessionId: sessionB, exerciseId }),
      bwSet(2, 5, { sessionId: sessionB, exerciseId }),
      bwSet(1, 4, { sessionId: sessionB, exerciseId }),
      bwSet(0, 12, { sessionId: sessionC, exerciseId }),
    ];
    exerciseLogRepositoryMock.getAllLogsByExerciseId.mockResolvedValue(logs);
    setRepositoryMock.getAllBeExerciseId.mockResolvedValue(sets);

    const result = await handler.query(query);

    expect(result).toEqual(
      expect.arrayContaining([
        logMatcher(logs[1].id, sessionB, 3, 4, 5),
        logMatcher(logs[2].id, sessionC, 12),
        logMatcher(logs[0].id, sessionA, 8, 10),
      ]),
    );
    expect(exerciseLogRepositoryMock.getAllLogsByExerciseId).toHaveBeenCalledExactlyOnceWith(
      exerciseId,
    );
    expect(setRepositoryMock.getAllBeExerciseId).toHaveBeenCalledExactlyOnceWith(exerciseId);
  });
});
