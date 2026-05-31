import { Command } from '@common/routers/command/command';

export class EditExerciseNoteCommand extends Command {
  constructor(public readonly notes: string, public readonly exerciseId: string) {
    super();
  }
}
