import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { EventBus } from '../../routers/event-bus';
import { Session } from '../../../domain/model/session.model';
import { DeleteSessionCommand } from './delete-session-command';
import { DeleteSessionCommandHandler } from './delete-session-command.handler';
import { SessionStore } from '../../../store/session/session.store';
import { SessionDeletedEvent } from '../../events/delete-session/session-deleted.event';

describe('DeleteSessionCommandHandler', () => {
  let eventBus: { dispatch: Mock };
  let sessionStore: { delete: Mock };
  let handler: DeleteSessionCommandHandler;

  beforeEach(() => {
    eventBus = { dispatch: vi.fn() };
    sessionStore = { delete: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStore, useValue: sessionStore },
        DeleteSessionCommandHandler,
      ],
    });

    handler = TestBed.inject(DeleteSessionCommandHandler);
  });

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(DeleteSessionCommand));

  test('should delete a session', () => {
    const command = new DeleteSessionCommand(Session.createEmpty());

    handler.handle(command);

    expect(sessionStore.delete).toHaveBeenCalledExactlyOnceWith(command.session);
    expect(eventBus.dispatch).toHaveBeenCalledExactlyOnceWith(
      new SessionDeletedEvent(command.session.uuid),
    );
  });
});
