import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '../command-handler.interface';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { SessionUpdatedEvent } from '../../events/session-updated/session-updated.event';
import { CreateSessionCommand } from './create-session-command';
import { Session } from '../../../domain/model/session/session.model';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class CreateSessionCommandHandler implements CommandHandler<CreateSessionCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<CreateSessionCommand> {
    return CreateSessionCommand;
  }

  public handle(command: CreateSessionCommand): void {
    const session = Session.createEmpty();
    this.sessionStateHolder.set(session);
    this.eventBus.dispatch(new SessionUpdatedEvent(session));
  }
}
