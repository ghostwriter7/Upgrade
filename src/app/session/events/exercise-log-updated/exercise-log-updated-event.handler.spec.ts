import { TestBed } from '@angular/core/testing';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';
import { Mock } from 'vitest';
import { ExerciseLog } from '../../../domain/model/session.model';
import { ExerciseLogUpdatedEventHandler } from './exercise-log-updated-event.handler';
import { ExerciseLogUpdatedEvent } from './exercise-log-updated.event';

describe('ExerciseLogUpdatedEventHandler', () => {
  let exerciseLogRepositoryMock: { saveLog: Mock };
  let handler: ExerciseLogUpdatedEventHandler;

  beforeEach(() => {
    exerciseLogRepositoryMock = { saveLog: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        ExerciseLogUpdatedEventHandler,
      ],
    });

    handler = TestBed.inject(ExerciseLogUpdatedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(ExerciseLogUpdatedEvent));

  it('should persist updated exercise log', () => {
    const event = new ExerciseLogUpdatedEvent(new ExerciseLog('sessionId', 'exerciseId', 'logId'));

    handler.handle(event);

    expect(exerciseLogRepositoryMock.saveLog).toHaveBeenCalledExactlyOnceWith(event.exerciseLog);
  });
});
