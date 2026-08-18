import { Command } from '@common/routers/command/command';

export class UpdateSessionRpeCommand extends Command {
  constructor(public readonly rpe?: number) {
    super();
  }
}
