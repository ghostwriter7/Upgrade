import { DomainEvent } from '@common/routers/event/domain-event';
import { Session } from '../../../domain/model/session/session.model';

export class SessionUpdatedEvent extends DomainEvent {
  constructor(public readonly session: Session) {
    super();
  }
}
