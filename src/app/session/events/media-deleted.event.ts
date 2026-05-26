import { DomainEvent } from './domain-event';

export class MediaDeletedEvent extends DomainEvent {
  constructor(public readonly mediaId: string) {
    super();
  }
}
