import { DomainEvent } from '@common/routers/event/domain-event';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';

export class SetUpdatedEvent extends DomainEvent {
  constructor(public readonly set: ExerciseSet) {
    super();
  }
}
