import { Command } from './command';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

export class PatchFinishedAtCommand extends Command {
  constructor(public readonly finishedAt: TemporalType.Instant) {
    super();
  }
}
