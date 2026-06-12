import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { EventBus } from '@common/routers/event/event-bus';
import { Session } from '@domain/model/session/session.model';
import { DeleteSessionCommand } from './delete-session-command';
import { DeleteSessionCommandHandler } from './delete-session-command.handler';
import { SessionStore } from '@store/session/session.store';
import { SessionDeletedEvent } from '../../events/delete-session/session-deleted.event';
import { SessionStateHolder } from '../../store/session-state-holder.store';

describe('DeleteSessionCommandHandler', () => {
  let eventBus: { publish: Mock };
  let sessionStore: { delete: Mock };
  let sessionStateHolder: { set: Mock };
  let handler: DeleteSessionCommandHandler;

  beforeEach(() => {
    eventBus = { publish: vi.fn() };
    sessionStore = { delete: vi.fn() };
    sessionStateHolder = { set: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStore, useValue: sessionStore },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        DeleteSessionCommandHandler,
      ],
    });

    handler = TestBed.inject(DeleteSessionCommandHandler);
  });

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(DeleteSessionCommand));

  test('should delete a session', () => {
    const command = new DeleteSessionCommand(
      Session.createEmpty().addExerciseLogs(['chin-ups', 'pull-ups']).session,
    );

    handler.handle(command);

    expect(sessionStore.delete).toHaveBeenCalledExactlyOnceWith(command.session);
    expect(eventBus.publish).toHaveBeenCalledExactlyOnceWith(
      new SessionDeletedEvent(command.session.uuid, command.session.exercises.map((log) => log.id)),
    );
    expect(sessionStateHolder.set).toHaveBeenCalledExactlyOnceWith(null);
  });
});
