import { DomainEvent } from '../domain-event';

import { ExerciseLog } from '../../../domain/model/exercise-log.model';

export class ExerciseLogCreatedEvent extends DomainEvent {
  constructor(public readonly exerciseLog: ExerciseLog) {
    super();
  }
}
