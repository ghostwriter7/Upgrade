import { Command } from '@common/routers/command/command';

export class PatchFinishedAtCommand extends Command {
  constructor(public readonly finishedAt: Temporal.Instant) {
    super();
  }
}
