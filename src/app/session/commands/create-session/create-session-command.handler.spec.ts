import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '../../routers/event-bus';
import { Session } from '../../../domain/model/session/session.model';
import { CreateSessionCommand } from './create-session-command';
import { CreateSessionCommandHandler } from './create-session-command.handler';
import { SessionUpdatedEvent } from '../../events/session-updated/session-updated.event';

describe('CreateSessionCommandHandler', () => {
  let eventBus: { dispatch: Mock };
  let sessionStateHolder: { set: Mock };
  let handler: CreateSessionCommandHandler;

  beforeEach(() => {
    eventBus = { dispatch: vi.fn() };
    sessionStateHolder = { set: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        CreateSessionCommandHandler,
      ],
    });

    handler = TestBed.inject(CreateSessionCommandHandler);
  });

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(CreateSessionCommand));

  test('should initialize a new session', () => {
    const command = new CreateSessionCommand();

    handler.handle(command);

    const session = sessionStateHolder.set.mock.calls[0][0];
    expect(sessionStateHolder.set).toHaveBeenCalledExactlyOnceWith(
      expect.toSatisfy((value) => value instanceof Session && value.exercises.length === 0),
    );
    expect(eventBus.dispatch).toHaveBeenCalledExactlyOnceWith(new SessionUpdatedEvent(session));
  });
});
