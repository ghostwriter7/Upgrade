import { DomainEvent } from '../domain-event';

export class SessionDeletedEvent extends DomainEvent {
  constructor(public readonly sessionId: string) {
    super();
  }
}
