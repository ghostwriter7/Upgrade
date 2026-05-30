import { inject, Injectable } from '@angular/core';
import { UpdateSetCommand } from './update-set.command';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { EventBus } from '../../routers/event-bus';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { SetUpdatedEvent } from '../../events/set-updated/set-updated.event';

@Injectable()
export class UpdateSetCommandHandler implements CommandHandler<UpdateSetCommand> {
  private readonly eventBus = inject(EventBus);
  private readonly sessionStateHolder = inject(SessionStateHolder);

  public appliesTo(): CommandConstructor<UpdateSetCommand> {
    return UpdateSetCommand;
  }

  public handle(command: UpdateSetCommand): void {
    const session = this.sessionStateHolder.session();

    if (session === null) throw new Error('Session is null');

    this.sessionStateHolder.set(session.updateSet(command.set));
    this.eventBus.dispatch(new SetUpdatedEvent(command.set));
  }
}
