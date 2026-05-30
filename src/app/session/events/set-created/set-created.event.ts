import { DomainEvent } from '../domain-event';
import { ExerciseSet } from '../../../domain/model/exercise-set.model';

export class SetCreatedEvent extends DomainEvent {
  constructor(public readonly set: ExerciseSet) {
    super();
  }
}
