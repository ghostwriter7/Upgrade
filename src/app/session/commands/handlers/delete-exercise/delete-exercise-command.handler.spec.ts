import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../../store/session-state-holder.store';
import { EventBus } from '../../../routers/event-bus';
import { AddExerciseCommand } from '../../add-exercise.command';
import { Session } from '../../../../domain/model/session.model';
import { ExerciseLogCreatedEvent } from '../../../events/exercise-log-created.event';
import { DeleteExerciseCommand } from '../../delete-exercise.command';
import { DeleteExerciseCommandHandler } from './delete-exercise-command.handler';
import { ExerciseLogDeletedEvent } from '../../../events/exercise-log-deleted.event';

describe('DeleteExerciseCommandHandler', () => {
  let eventBus: { dispatch: Mock };
  let sessionStateHolder: { session: Mock; set: Mock };
  let handler: DeleteExerciseCommandHandler;

  beforeEach(() => {
    eventBus = { dispatch: vi.fn() };
    sessionStateHolder = { session: vi.fn(), set: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        DeleteExerciseCommandHandler,
      ],
    });

    handler = TestBed.inject(DeleteExerciseCommandHandler);
  });

  test('should delete an exercise log', () => {
    const command = new DeleteExerciseCommand('exerciseId');
    const session = Session.createEmpty().addExercise('exerciseId');
    const exerciseLog = session.exercises[0];
    sessionStateHolder.session.mockReturnValueOnce(session);

    handler.handle(command);

    const expectedSession = session.clone();
    expectedSession.exercises = [];
    expect(sessionStateHolder.set).toHaveBeenCalledWith(expectedSession);
    expect(eventBus.dispatch).toHaveBeenCalledExactlyOnceWith(
      new ExerciseLogDeletedEvent(exerciseLog),
    );
  });
});
