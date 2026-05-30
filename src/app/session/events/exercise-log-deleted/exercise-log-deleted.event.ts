import { DomainEvent } from '../domain-event';
import { ExerciseLog } from '../../../domain/model/session.model';

export class ExerciseLogDeletedEvent extends DomainEvent {
  constructor(public readonly exerciseLog: ExerciseLog) {
    super();
  }
}
