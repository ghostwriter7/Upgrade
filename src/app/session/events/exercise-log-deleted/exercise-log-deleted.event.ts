import { DomainEvent } from '@common/routers/event/domain-event';

import { ExerciseLog } from '../../../domain/model/exercise-log.model';

export class ExerciseLogDeletedEvent extends DomainEvent {
  constructor(public readonly exerciseLog: ExerciseLog) {
    super();
  }
}
