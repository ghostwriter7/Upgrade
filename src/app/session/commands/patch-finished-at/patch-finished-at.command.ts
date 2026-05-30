import { Command } from '../command';

export class PatchFinishedAtCommand extends Command {
  constructor(public readonly finishedAt: Temporal.Instant) {
    super();
  }
}
