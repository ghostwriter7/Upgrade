import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '../command-handler.interface';
import { PatchStartedAtCommand } from './patch-started-at.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { SessionUpdatedEvent } from '../../events/session-updated/session-updated.event';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class PatchStartedAtCommandHandler implements CommandHandler<PatchStartedAtCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<PatchStartedAtCommand> {
    return PatchStartedAtCommand;
  }

  public handle(command: PatchStartedAtCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.clone();
    updatedSession.startedAt = command.startedAt;

    this.sessionStateHolder.set(updatedSession);

    this.eventBus.publish(new SessionUpdatedEvent(updatedSession));
  }
}
