import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../../store/session-state-holder.store';
import { AddExerciseCommandHandler } from './add-exercise-command.handler';
import { EventBus } from '../../../routers/event-bus';
import { AddExerciseCommand } from '../../add-exercise.command';
import { Session } from '../../../../domain/model/session.model';

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

  test('should add exercises to the empty session', () => {
    const command = new AddExerciseCommand(['chin-ups', 'pull-ups', 'deadlifts']);
    sessionStateHolder.session.mockReturnValueOnce(Session.createEmpty());

    handler.handle(command);

    const sessionMatcher = expect.objectContaining({
      exercises: expect.arrayContaining([
        expect.objectContaining({ exerciseId: 'chin-ups' }),
        expect.objectContaining({ exerciseId: 'pull-ups' }),
        expect.objectContaining({ exerciseId: 'deadlifts' }),
      ]),
    });
    expect(sessionStateHolder.set).toHaveBeenCalledWith(sessionMatcher);
    expect(eventBus.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        session: sessionMatcher,
      }),
    );
  });
});
