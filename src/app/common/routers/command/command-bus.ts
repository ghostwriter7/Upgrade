import { inject, Injectable } from '@angular/core';
import { Command } from '@common/routers/command/command';
import { COMMAND_HANDLERS } from '@common/routers/command/command-handlers.token';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { Constructor } from '@common/types/constructor.type';

@Injectable({ providedIn: 'root' })
export class CommandBus {
  private readonly handlers: CommandHandler[] = inject(COMMAND_HANDLERS);
  private readonly lookup = this.handlers.reduce((lookup, handler) => {
    lookup.set(handler.appliesTo(), handler);
    return lookup;
  }, new Map<Constructor<Command>, CommandHandler>());

  public dispatch(command: Command): void {
    const handler = this.lookup.get(command.constructor as Constructor<Command>);

    if (!handler) {
      throw new Error(`No handler found for command: ${command.constructor.name}`);
    }

    handler.handle(command);
  }
}
