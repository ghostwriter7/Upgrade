import { Mock } from 'vitest';
import { GetInitialSetForExerciseIdQueryHandler } from '@session/queries/get-initial-set-for-exercise-id/get-initial-set-for-exercise-id-query.handler';
import { TestBed } from '@angular/core/testing';
import { SetRepository } from '@persistence/repository/set.repository';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { GetInitialSetForExerciseIdQuery } from '@session/queries/get-initial-set-for-exercise-id/get-initial-set-for-exercise-id.query';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { weightSet } from '@test/fixtures/exercise-set.fixtures';
import { DEFAULT_SET_DATA } from '@session/queries/get-initial-set-for-exercise-id/default-set-data.const';

describe('GetInitialSetForExerciseIdQueryHandler', () => {
  let setRepositoryMock: { getAllBySessionIdAndExerciseId: Mock };
  let exerciseLogRepositoryMock: { findLatestExerciseLogsByExerciseId: Mock };
  let handler: GetInitialSetForExerciseIdQueryHandler;

  beforeEach(() => {
    setRepositoryMock = { getAllBySessionIdAndExerciseId: vi.fn() };
    exerciseLogRepositoryMock = { findLatestExerciseLogsByExerciseId: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: SetRepository, useValue: setRepositoryMock },
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        GetInitialSetForExerciseIdQueryHandler,
      ],
    });

    handler = TestBed.inject(GetInitialSetForExerciseIdQueryHandler);
  });

  const exerciseId = 'chin-ups';

  it('should return a default initial set when there are no exercise logs yet', async () => {
    exerciseLogRepositoryMock.findLatestExerciseLogsByExerciseId.mockResolvedValue([]);

    const result = await handler.query(new GetInitialSetForExerciseIdQuery(exerciseId));

    expect(
      exerciseLogRepositoryMock.findLatestExerciseLogsByExerciseId,
    ).toHaveBeenCalledExactlyOnceWith(exerciseId, 5);
    expect(setRepositoryMock.getAllBySessionIdAndExerciseId).not.toHaveBeenCalled();
    expect(result).toEqual(DEFAULT_SET_DATA);
  });

  const log = (sessionId: string) => new ExerciseLog(sessionId, exerciseId);

  it('should return a default initial set when empty exercise logs exist', async () => {
    const logs = [log('sessionA'), log('sessionB'), log('sessionC')];
    exerciseLogRepositoryMock.findLatestExerciseLogsByExerciseId.mockResolvedValue(logs);
    setRepositoryMock.getAllBySessionIdAndExerciseId.mockResolvedValue([]);

    const result = await handler.query(new GetInitialSetForExerciseIdQuery(exerciseId));

    expect(
      exerciseLogRepositoryMock.findLatestExerciseLogsByExerciseId,
    ).toHaveBeenCalledExactlyOnceWith(exerciseId, 5);
    expect(setRepositoryMock.getAllBySessionIdAndExerciseId).toHaveBeenNthCalledWith(
      1,
      logs[0].sessionId, exerciseId
    );
    expect(setRepositoryMock.getAllBySessionIdAndExerciseId).toHaveBeenNthCalledWith(
      2,
      logs[1].sessionId, exerciseId
    );
    expect(setRepositoryMock.getAllBySessionIdAndExerciseId).toHaveBeenNthCalledWith(
      3,
      logs[2].sessionId, exerciseId
    );
    expect(result).toEqual(DEFAULT_SET_DATA);
  });

  it('should return the last performed set when one exists', async () => {
    const logs = [log('sessionA')];
    exerciseLogRepositoryMock.findLatestExerciseLogsByExerciseId.mockResolvedValue(logs);
    setRepositoryMock.getAllBySessionIdAndExerciseId.mockResolvedValue([
      weightSet(0, 10, 10),
      weightSet(1, 10, 20),
      weightSet(2, 10, 30),
    ]);

    const result = await handler.query(new GetInitialSetForExerciseIdQuery(exerciseId));

    expect(
      exerciseLogRepositoryMock.findLatestExerciseLogsByExerciseId,
    ).toHaveBeenCalledExactlyOnceWith(exerciseId, 5);
    expect(setRepositoryMock.getAllBySessionIdAndExerciseId).toHaveBeenCalledExactlyOnceWith(
      logs[0].sessionId, exerciseId
    );
    expect(result).toEqual({ reps: 10, weight: 30, duration: 0, type: 'weight' });
  });
});
