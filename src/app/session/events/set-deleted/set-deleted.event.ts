import { DomainEvent } from '@common/routers/event/domain-event';

export class SetDeletedEvent extends DomainEvent {
  constructor(public readonly setId: string) {
    super();
  }
}
