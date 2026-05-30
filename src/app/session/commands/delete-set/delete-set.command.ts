import { ExerciseSet } from '../../../domain/model/exercise-set.model';
import { Command } from '../command';

export class DeleteSetCommand extends Command {
  constructor(public readonly set: ExerciseSet) {
    super();
  }
}
