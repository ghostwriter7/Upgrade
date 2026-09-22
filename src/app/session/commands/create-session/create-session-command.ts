import { Command } from '@common/routers/command/command';

export class CreateSessionCommand extends Command {
  constructor(public readonly skillId?: string) {
    super();
  }
}
