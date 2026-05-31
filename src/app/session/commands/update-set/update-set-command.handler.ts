import { inject, Injectable } from '@angular/core';
import { UpdateSetCommand } from './update-set.command';
import { CommandHandler } from '../command-handler.interface';
import { EventBus } from '@common/routers/event/event-bus';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { SetUpdatedEvent } from '../../events/set-updated/set-updated.event';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class UpdateSetCommandHandler implements CommandHandler<UpdateSetCommand> {
  private readonly eventBus = inject(EventBus);
  private readonly sessionStateHolder = inject(SessionStateHolder);

  public appliesTo(): Constructor<UpdateSetCommand> {
    return UpdateSetCommand;
  }

  public handle(command: UpdateSetCommand): void {
    const session = this.sessionStateHolder.session();

    if (session === null) throw new Error('Session is null');

    this.sessionStateHolder.set(session.updateSet(command.set));
    this.eventBus.publish(new SetUpdatedEvent(command.set));
  }
}
