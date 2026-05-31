import { Command } from '@common/routers/command/command';
import { ExerciseSet } from '../../../domain/model/exercise-set.model';

export class CopySetCommand extends Command {
  constructor(public readonly set: ExerciseSet) {
    super();
  }
}
