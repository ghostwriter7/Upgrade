import { inject, Injectable } from '@angular/core';
import { Command } from '../commands/command';
import { COMMAND_HANDLERS } from '../commands/handlers/command-handlers.token';
import { CommandConstructor, CommandHandler } from '../commands/handlers/command-handler.interface';

@Injectable({ providedIn: 'root' })
export class CommandBus {

  private readonly handlers: CommandHandler[] = inject(COMMAND_HANDLERS);
  private readonly lookup = this.handlers.reduce((lookup, handler) => {
    lookup.set(handler.appliesTo(), handler);
    return lookup;
  }, new Map<CommandConstructor, CommandHandler>())

  public dispatch(command: Command): void {
    const handler = this.lookup.get(command.constructor as CommandConstructor);

    if (!handler) {
      throw new Error(`No handler found for command: ${command.constructor.name}`);
    }

    handler.handle(command);
  }
}
