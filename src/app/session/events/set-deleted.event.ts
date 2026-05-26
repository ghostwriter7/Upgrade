import { DomainEvent } from './domain-event';

export class SetDeletedEvent extends DomainEvent {
  constructor(public readonly setId: number) {
    super();
  }
}
