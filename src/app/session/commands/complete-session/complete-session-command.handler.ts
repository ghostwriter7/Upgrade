import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { CompleteSessionCommand } from './complete-session.command';
import { DateHelper } from '../../../common/helper/date.helper';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { SessionUpdatedEvent } from '../../events/session-updated/session-updated.event';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class CompleteSessionCommandHandler implements CommandHandler<CompleteSessionCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<CompleteSessionCommand> {
    return CompleteSessionCommand;
  }

  public handle(command: CompleteSessionCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.clone();
    updatedSession.finishedAt = DateHelper.now();

    this.sessionStateHolder.set(updatedSession);

    this.eventBus.publish(new SessionUpdatedEvent(updatedSession));
  }

}
