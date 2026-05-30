import { TestBed } from '@angular/core/testing';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';
import { Mock } from 'vitest';
import { ExerciseLog } from '../../../domain/model/session.model';
import { ExerciseLogDeletedEventHandler } from './exercise-log-deleted-event.handler';
import { ExerciseLogDeletedEvent } from './exercise-log-deleted.event';
import { SetRepository } from '../../../persistence/repository/set.repository';

describe('ExerciseLogDeletedEventHandler', () => {
  let exerciseLogRepositoryMock: { deleteLog: Mock };
  let setRepository: { deleteBySessionAndExercise: Mock };
  let handler: ExerciseLogDeletedEventHandler;

  beforeEach(() => {
    exerciseLogRepositoryMock = { deleteLog: vi.fn() };
    setRepository = { deleteBySessionAndExercise: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        { provide: SetRepository, useValue: setRepository },
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

    expect(exerciseLogRepositoryMock.deleteLog).toHaveBeenCalledExactlyOnceWith(
      event.exerciseLog.id,
    );
    expect(setRepository.deleteBySessionAndExercise).toHaveBeenCalledExactlyOnceWith(
      event.exerciseLog.sessionId,
      event.exerciseLog.exerciseId,
    );
  });
});
