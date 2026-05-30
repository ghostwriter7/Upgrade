import { inject, Injectable } from '@angular/core';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '../../routers/event-bus';
import { SessionUpdatedEvent } from '../../events/session-updated/session-updated.event';
import { CreateSessionCommand } from './create-session-command';
import { Session } from '../../../domain/model/session.model';

@Injectable()
export class CreateSessionCommandHandler implements CommandHandler<CreateSessionCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): CommandConstructor<CreateSessionCommand> {
    return CreateSessionCommand;
  }

  public handle(command: CreateSessionCommand): void {
    const session = Session.createEmpty();
    this.sessionStateHolder.set(session);
    this.eventBus.dispatch(new SessionUpdatedEvent(session));
  }
}
