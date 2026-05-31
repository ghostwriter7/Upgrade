import { Command } from '@common/routers/command/command';

export class AddExerciseCommand extends Command {
  constructor(public readonly exerciseIds: string[]) {
    super();
  }
}
