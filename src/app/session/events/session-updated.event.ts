import { DomainEvent } from './domain-event';
import { Session } from '../../domain/model/session.model';

export class SessionUpdatedEvent extends DomainEvent {
  constructor(public readonly session: Session) {
    super();
  }
}
