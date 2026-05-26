import { Command } from './command';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { SetData } from '../components/set-form/set-form';

export class CreateSetCommand extends Command {
  constructor(public readonly setData: SetData, public readonly exerciseId: string) {
    super();
  }
}
