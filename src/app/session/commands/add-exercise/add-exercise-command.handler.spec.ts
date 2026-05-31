import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { AddExerciseCommandHandler } from './add-exercise-command.handler';
import { EventBus } from '@common/routers/event/event-bus';
import { AddExerciseCommand } from './add-exercise.command';
import { Session } from '../../../domain/model/session/session.model';
import { ExerciseLogCreatedEvent } from '../../events/exercise-log-created/exercise-log-created.event';

describe('AddExerciseCommandHandler', () => {
  let eventBus: { dispatch: Mock };
  let sessionStateHolder: { session: Mock; set: Mock };
  let handler: AddExerciseCommandHandler;

  beforeEach(() => {
    eventBus = { dispatch: vi.fn() };
    sessionStateHolder = { session: vi.fn(), set: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        AddExerciseCommandHandler,
      ],
    });

    handler = TestBed.inject(AddExerciseCommandHandler);
  });

  test('should return a correct command type it can handle', () =>
    expect(handler.appliesTo()).toEqual(AddExerciseCommand));

  test('should add exercises to the empty session', () => {
    const command = new AddExerciseCommand(['chin-ups', 'pull-ups', 'deadlifts']);
    const session = Session.createEmpty();
    sessionStateHolder.session.mockReturnValueOnce(session);

    handler.handle(command);

    expect(sessionStateHolder.set).toHaveBeenCalledWith(
      expect.objectContaining({
        exercises: expect.arrayContaining([
          expect.objectContaining({ exerciseId: 'chin-ups' }),
          expect.objectContaining({ exerciseId: 'pull-ups' }),
          expect.objectContaining({ exerciseId: 'deadlifts' }),
        ]),
      }),
    );
    expect(eventBus.dispatch).toHaveBeenCalledTimes(3);
    const matcher = (exerciseId: string) =>
      new ExerciseLogCreatedEvent(
        expect.objectContaining({
          sessionId: session.uuid,
          exerciseId,
          id: expect.any(String),
        }),
      );
    expect(eventBus.dispatch).toHaveBeenNthCalledWith(1, matcher('chin-ups'));
    expect(eventBus.dispatch).toHaveBeenNthCalledWith(2, matcher('pull-ups'));
    expect(eventBus.dispatch).toHaveBeenNthCalledWith(3, matcher('deadlifts'));
  });
});
