import { Command } from './command';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

export class PatchStartedAtCommand extends Command {
  constructor(public readonly startedAt: TemporalType.Instant) {
    super();
  }
}
