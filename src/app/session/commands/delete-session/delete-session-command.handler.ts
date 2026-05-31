import { CommandHandler } from '../command-handler.interface';
import { inject, Injectable } from '@angular/core';
import { EventBus } from '@common/routers/event/event-bus';
import { DeleteSessionCommand } from './delete-session-command';
import { SessionDeletedEvent } from '../../events/delete-session/session-deleted.event';
import { SessionStore } from '../../../store/session/session.store';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class DeleteSessionCommandHandler implements CommandHandler<DeleteSessionCommand> {
  private readonly sessionStore = inject(SessionStore);
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<DeleteSessionCommand> {
    return DeleteSessionCommand;
  }

  public handle({ session }: DeleteSessionCommand): void {
    this.sessionStore.delete(session);
    this.sessionStateHolder.set(null);
    this.eventBus.publish(new SessionDeletedEvent(session.uuid));
  }
}
