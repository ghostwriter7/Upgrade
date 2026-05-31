import { Command } from '@common/routers/command/command';

export class DeleteExerciseCommand extends Command {
  constructor(public readonly exerciseId: string) {
    super();
  }
}
