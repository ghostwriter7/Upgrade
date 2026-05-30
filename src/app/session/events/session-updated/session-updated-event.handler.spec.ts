import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { SessionUpdatedEvent } from './session-updated.event';
import { SessionUpdatedEventHandler } from './session-updated-event.handler';
import { SessionRepository } from '../../../persistence/repository/session.repository';
import { Session } from '../../../domain/model/session.model';

describe('SessionUpdatedEventHandler', () => {
  let sessionRepositoryMock: { save: Mock };
  let handler: SessionUpdatedEventHandler;

  beforeEach(() => {
    sessionRepositoryMock = { save: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        SessionUpdatedEventHandler,
      ],
    });

    handler = TestBed.inject(SessionUpdatedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(SessionUpdatedEvent));

  it('should save a session', () => {
    const event = new SessionUpdatedEvent(Session.createEmpty());

    handler.handle(event);

    expect(sessionRepositoryMock.save).toHaveBeenCalledExactlyOnceWith(event.session);
  });
});
