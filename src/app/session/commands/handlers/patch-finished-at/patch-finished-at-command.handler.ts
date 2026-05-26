import { inject, Injectable } from '@angular/core';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { PatchFinishedAtCommand } from '../../patch-finished-at.command';
import { SessionStateHolder } from '../../../store/session-state-holder.store';
import { EventBus } from '../../../routers/event-bus';
import { SessionUpdatedEvent } from '../../../events/session-updated.event';

@Injectable()
export class PatchFinishedAtCommandHandler implements CommandHandler<PatchFinishedAtCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): CommandConstructor<PatchFinishedAtCommand> {
    return PatchFinishedAtCommand;
  }

  public handle(command: PatchFinishedAtCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.clone();
    updatedSession.finishedAt = command.finishedAt;

    this.sessionStateHolder.set(updatedSession);

    this.eventBus.dispatch(new SessionUpdatedEvent(updatedSession));
  }
}
