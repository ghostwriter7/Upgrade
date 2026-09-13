import { TestBed } from '@angular/core/testing';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { Mock } from 'vitest';
import { ExerciseLogDeletedEventHandler } from './exercise-log-deleted-event.handler';
import { ExerciseLogDeletedEvent } from './exercise-log-deleted.event';
import { SetRepository } from '@persistence/repository/set.repository';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { MediaRepository } from '@persistence/repository/media.repository';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement.repository';

describe('ExerciseLogDeletedEventHandler', () => {
  let exerciseLogRepositoryMock: { deleteLog: Mock };
  let setRepository: { deleteBySessionAndExercise: Mock };
  let mediaRepository: { deleteAllByExerciseLogId: Mock };
  let angleMeasurementRepository: { deleteAllByExerciseLogId: Mock };

  let handler: ExerciseLogDeletedEventHandler;

  beforeEach(() => {
    exerciseLogRepositoryMock = { deleteLog: vi.fn() };
    setRepository = { deleteBySessionAndExercise: vi.fn() };
    mediaRepository = { deleteAllByExerciseLogId: vi.fn() };
    angleMeasurementRepository = { deleteAllByExerciseLogId: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        { provide: SetRepository, useValue: setRepository },
        { provide: MediaRepository, useValue: mediaRepository },
        { provide: AngleMeasurementRepository, useValue: angleMeasurementRepository },
        ExerciseLogDeletedEventHandler,
      ],
    });

    handler = TestBed.inject(ExerciseLogDeletedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(ExerciseLogDeletedEvent));

  it('should delete exercise log and related sets', () => {
    const event = new ExerciseLogDeletedEvent(new ExerciseLog('sessionId', 'exerciseId', 'logId'));

    handler.handle(event);

    const { exerciseLog } = event;
    expect(exerciseLogRepositoryMock.deleteLog).toHaveBeenCalledExactlyOnceWith(exerciseLog.id);
    expect(setRepository.deleteBySessionAndExercise).toHaveBeenCalledExactlyOnceWith(
      exerciseLog.sessionId,
      exerciseLog.exerciseId,
    );
    expect(mediaRepository.deleteAllByExerciseLogId).toHaveBeenCalledExactlyOnceWith(
      exerciseLog.id,
    );
    expect(angleMeasurementRepository.deleteAllByExerciseLogId).toHaveBeenCalledExactlyOnceWith(
      exerciseLog.id,
    );
  });
});
