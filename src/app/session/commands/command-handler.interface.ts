import { Command } from './command';
import { Constructor } from '@common/types/constructor.type';

export interface CommandHandler<T extends Command = Command> {
  appliesTo(): Constructor<T>;

  handle(command: T): void;
}
