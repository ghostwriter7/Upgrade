import { inject, Injectable } from '@angular/core';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { CompleteSessionCommand } from './complete-session.command';
import { DateHelper } from '../../../common/helper/date.helper';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '../../routers/event-bus';
import { SessionUpdatedEvent } from '../../events/session-updated/session-updated.event';

@Injectable()
export class CompleteSessionCommandHandler implements CommandHandler<CompleteSessionCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): CommandConstructor<CompleteSessionCommand> {
    return CompleteSessionCommand;
  }

  public handle(command: CompleteSessionCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.clone();
    updatedSession.finishedAt = DateHelper.now();

    this.sessionStateHolder.set(updatedSession);

    this.eventBus.dispatch(new SessionUpdatedEvent(updatedSession));
  }

}
