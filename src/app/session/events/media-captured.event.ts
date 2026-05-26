import { DomainEvent } from './domain-event';
import { ExerciseMedia } from '../../domain/model/exercise-media.model';

export class MediaCapturedEvent extends DomainEvent {
  constructor(public readonly media: ExerciseMedia) {
    super();
  }
}
