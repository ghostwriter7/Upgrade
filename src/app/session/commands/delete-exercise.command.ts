import { Command } from './command';

export class DeleteExerciseCommand extends Command {
  constructor(public readonly exerciseId: string) {
    super();
  }
}
