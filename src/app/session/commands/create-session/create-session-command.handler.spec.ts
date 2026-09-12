import { describe, Mock, test, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { Session } from '@domain/model/session/session.model';
import { CreateSessionCommand } from './create-session-command';
import { CreateSessionCommandHandler } from './create-session-command.handler';
import { SessionUpdatedEvent } from '../../events/session-updated/session-updated.event';

describe('CreateSessionCommandHandler', () => {
  let eventBus: { publish: Mock };
  let sessionStateHolder: { set: Mock };
  let handler: CreateSessionCommandHandler;

  beforeEach(() => {
    eventBus = { publish: vi.fn() };
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
      expect.toSatisfy((value) => value instanceof Session && value.exerciseLogs.length === 0),
    );
    expect(eventBus.publish).toHaveBeenCalledExactlyOnceWith(new SessionUpdatedEvent(session));
  });
});
