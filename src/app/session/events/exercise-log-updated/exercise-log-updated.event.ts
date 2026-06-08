import { DomainEvent } from '@common/routers/event/domain-event';

import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';

export class ExerciseLogUpdatedEvent extends DomainEvent {
  constructor(public readonly exerciseLog: ExerciseLog) {
    super();
  }
}
