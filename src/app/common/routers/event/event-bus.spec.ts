import { TestBed } from '@angular/core/testing';
import { Session } from '@domain/model/session/session.model';
import { BodyweightSet } from '@domain/model/exercise-set.model';
import { DomainEvent } from '@session/events/domain-event';
import { SessionUpdatedEvent } from '@session/events/session-updated/session-updated.event';
import { SessionDeletedEvent } from '@session/events/delete-session/session-deleted.event';
import { SetUpdatedEvent } from '@session/events/set-updated/set-updated.event';
import { EventBus } from '@common/routers/event/event-bus';
import { EVENT_HANDLERS } from '@session/events/event-handlers.token';
import { EventHandler } from '@session/events/event-handler.interface';
import { Constructor } from '@common/types/constructor.type';

class UnknownEvent extends DomainEvent {
  constructor() {
    super();
  }
}

class AnotherSessionUpdatedEventHandler implements EventHandler<SessionUpdatedEvent> {
  public appliesTo(): Constructor<SessionUpdatedEvent> {
    return SessionUpdatedEvent;
  }

  public readonly handle = vi.fn();
}

describe('EventBus', () => {
  const [handlerA, handlerB, handlerC] = [
    SessionUpdatedEvent,
    SessionDeletedEvent,
    SetUpdatedEvent,
  ].map((constructor) => ({ appliesTo: () => constructor, handle: vi.fn() }));

  const handlerD = new AnotherSessionUpdatedEventHandler();

  let bus: EventBus;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        EventBus,
        { provide: EVENT_HANDLERS, multi: true, useValue: handlerA },
        { provide: EVENT_HANDLERS, multi: true, useValue: handlerB },
        { provide: EVENT_HANDLERS, multi: true, useValue: handlerC },
        { provide: EVENT_HANDLERS, multi: true, useValue: handlerD },
      ],
    });

    bus = TestBed.inject(EventBus);
  });

  test.each([
    {
      command: new SessionUpdatedEvent(Session.createEmpty()),
      expectedHandlers: [handlerA, handlerD],
    },
    { command: new SessionDeletedEvent('anyId'), expectedHandlers: [handlerB] },
    {
      command: new SetUpdatedEvent(new BodyweightSet('sessionId', 'exerciseId', 0, 1)),
      expectedHandlers: [handlerC],
    },
  ])('should publish an event to the interested handlers', ({ command, expectedHandlers }) => {
    bus.publish(command);

    expectedHandlers.forEach((handler) =>
      expect(handler.handle).toHaveBeenCalledExactlyOnceWith(command),
    );
  });

  it('should throw an error when no handler is found for the event', () => {
    const command = new UnknownEvent();

    expect(() => bus.publish(command)).toThrow('No handler found for event: UnknownEvent');
  });
});
