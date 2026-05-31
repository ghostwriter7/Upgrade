import { DomainEvent } from '@common/routers/event/domain-event';
import { ExerciseSet } from '../../../domain/model/exercise-set.model';

export class SetCreatedEvent extends DomainEvent {
  constructor(public readonly set: ExerciseSet) {
    super();
  }
}
