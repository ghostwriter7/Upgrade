import { TestBed } from '@angular/core/testing';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';
import { ExerciseLogCreatedEvent } from './exercise-log-created.event';
import { Mock } from 'vitest';
import { ExerciseLogCreatedEventHandler } from './exercise-log-created-event.handler';

import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';

describe('ExerciseLogCreatedEventHandler', () => {
  let exerciseLogRepositoryMock: { saveLog: Mock };
  let handler: ExerciseLogCreatedEventHandler;

  beforeEach(() => {
    exerciseLogRepositoryMock = { saveLog: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        ExerciseLogCreatedEventHandler,
      ],
    });

    handler = TestBed.inject(ExerciseLogCreatedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(ExerciseLogCreatedEvent));

  it('should persist exercise log', () => {
    const event = new ExerciseLogCreatedEvent(
      new ExerciseLog('sessionId', 'exerciseId', 'logId')
    );

    handler.handle(event);

    expect(exerciseLogRepositoryMock.saveLog).toHaveBeenCalledExactlyOnceWith(event.exerciseLog);
  })
});
