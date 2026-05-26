import { Command } from './command';

export class AddExerciseCommand extends Command {
  constructor(public readonly exerciseIds: string[]) {
    super();
  }
}
