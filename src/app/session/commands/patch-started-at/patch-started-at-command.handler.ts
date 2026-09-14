import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { PatchStartedAtCommand } from './patch-started-at.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@common/types/constructor.type';
import { SessionRepository } from '@persistence/repository/session.repository';

@Injectable()
export class PatchStartedAtCommandHandler implements CommandHandler<PatchStartedAtCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<PatchStartedAtCommand> {
    return PatchStartedAtCommand;
  }

  public handle(command: PatchStartedAtCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.clone();
    updatedSession.startedAt = command.startedAt;

    this.sessionStateHolder.set(updatedSession);

    this.sessionRepository.update(updatedSession);
  }
}
