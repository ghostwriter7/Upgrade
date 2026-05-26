import { Command } from '../command';

export type CommandConstructor<T extends Command = Command> = new (...args: any[]) => T;

export interface CommandHandler<T extends Command = Command> {
  appliesTo(): CommandConstructor<T>;

  handle(command: T): void;
}
