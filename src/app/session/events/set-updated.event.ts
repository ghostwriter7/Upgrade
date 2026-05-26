import { DomainEvent } from './domain-event';
import { ExerciseSet } from '../../domain/model/exercise-set.model';

export class SetUpdatedEvent extends DomainEvent {
  constructor(public readonly set: ExerciseSet) {
    super();
  }
}
