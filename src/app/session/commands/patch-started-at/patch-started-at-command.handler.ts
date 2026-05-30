import { inject, Injectable } from '@angular/core';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { PatchStartedAtCommand } from './patch-started-at.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '../../routers/event-bus';
import { SessionUpdatedEvent } from '../../events/session-updated/session-updated.event';

@Injectable()
export class PatchStartedAtCommandHandler implements CommandHandler<PatchStartedAtCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): CommandConstructor<PatchStartedAtCommand> {
    return PatchStartedAtCommand;
  }

  public handle(command: PatchStartedAtCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.clone();
    updatedSession.startedAt = command.startedAt;

    this.sessionStateHolder.set(updatedSession);

    this.eventBus.dispatch(new SessionUpdatedEvent(updatedSession));
  }
}
