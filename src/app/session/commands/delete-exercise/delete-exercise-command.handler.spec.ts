import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { Session } from '@domain/model/session/session.model';
import { DeleteExerciseCommand } from './delete-exercise.command';
import { DeleteExerciseCommandHandler } from './delete-exercise-command.handler';
import { ExerciseLogDeletedEvent } from '../../events/exercise-log-deleted/exercise-log-deleted.event';
import { ExerciseLogUpdatedEvent } from '../../events/exercise-log-updated/exercise-log-updated.event';

describe('DeleteExerciseCommandHandler', () => {
  let eventBus: { publish: Mock };
  let sessionStateHolder: { session: Mock; set: Mock };
  let handler: DeleteExerciseCommandHandler;

  beforeEach(() => {
    eventBus = { publish: vi.fn() };
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

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(DeleteExerciseCommand));

  test('should delete an exercise log', () => {
    const command = new DeleteExerciseCommand('exerciseId');
    const { session } = Session.createEmpty().addExerciseLog('exerciseId');
    const exerciseLog = session.exercises[0];
    sessionStateHolder.session.mockReturnValueOnce(session);

    handler.handle(command);

    const expectedSession = session.clone();
    expectedSession.exercises = [];
    expect(sessionStateHolder.set).toHaveBeenCalledWith(expectedSession);
    expect(eventBus.publish).toHaveBeenCalledExactlyOnceWith(
      new ExerciseLogDeletedEvent(exerciseLog),
    );
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
  });

  test('should dispatch ExerciseLogUpdatedEvents for re-indexed logs', () => {
    const command = new DeleteExerciseCommand('chin-ups');
    const { session } = Session.createEmpty().addExerciseLogs('chin-ups', 'pull-ups', 'l-sit');
    const exerciseLog = session.exercises[0];
    sessionStateHolder.session.mockReturnValueOnce(session);
    const expectedSession = session.clone();
    expectedSession.exercises = [
      session.exercises[1].withIndex(0),
      session.exercises[2].withIndex(1),
    ];

    handler.handle(command);

    expect(sessionStateHolder.set).toHaveBeenCalledWith(expectedSession);
    expect(eventBus.publish).toHaveBeenCalledTimes(3);
    expect(eventBus.publish).toHaveBeenNthCalledWith(1, new ExerciseLogDeletedEvent(exerciseLog));
    expect(eventBus.publish).toHaveBeenNthCalledWith(
      2,
      new ExerciseLogUpdatedEvent(expectedSession.exercises[0]),
    );
    expect(eventBus.publish).toHaveBeenNthCalledWith(
      3,
      new ExerciseLogUpdatedEvent(expectedSession.exercises[1]),
    );
  });
});
