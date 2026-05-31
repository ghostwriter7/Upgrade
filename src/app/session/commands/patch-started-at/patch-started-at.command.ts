import { Command } from '@common/routers/command/command';

export class PatchStartedAtCommand extends Command {
  constructor(public readonly startedAt: Temporal.Instant) {
    super();
  }
}
