import { DomainEvent } from './domain-event';
import { ExerciseLog } from '../../domain/model/session.model';

export class ExerciseLogUpdatedEvent extends DomainEvent {
  constructor(public readonly exerciseLog: ExerciseLog) {
    super();
  }
}
