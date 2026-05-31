import { DomainEvent } from '@common/routers/event/domain-event';

export class SessionDeletedEvent extends DomainEvent {
  constructor(public readonly sessionId: string) {
    super();
  }
}
