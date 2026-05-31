import { DomainEvent } from '@common/routers/event/domain-event';

export class MediaDeletedEvent extends DomainEvent {
  constructor(public readonly mediaId: string) {
    super();
  }
}
