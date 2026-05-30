import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { inject, Injectable } from '@angular/core';
import { EventBus } from '../../routers/event-bus';
import { DeleteSessionCommand } from './delete-session-command';
import { SessionDeletedEvent } from '../../events/delete-session/session-deleted.event';
import { SessionStore } from '../../../store/session/session.store';

@Injectable()
export class DeleteSessionCommandHandler implements CommandHandler<DeleteSessionCommand> {
  private readonly sessionStore = inject(SessionStore);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): CommandConstructor<DeleteSessionCommand> {
    return DeleteSessionCommand;
  }

  public handle({ session }: DeleteSessionCommand): void {
    this.sessionStore.delete(session);
    this.eventBus.dispatch(new SessionDeletedEvent(session.uuid));
  }
}
