import { Command } from '../command';

export class PatchStartedAtCommand extends Command {
  constructor(public readonly startedAt: Temporal.Instant) {
    super();
  }
}
