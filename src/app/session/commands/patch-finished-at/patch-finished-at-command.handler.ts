import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { PatchFinishedAtCommand } from './patch-finished-at.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@common/types/constructor.type';
import { SessionRepository } from '@persistence/repository/session.repository';

@Injectable()
export class PatchFinishedAtCommandHandler implements CommandHandler<PatchFinishedAtCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<PatchFinishedAtCommand> {
    return PatchFinishedAtCommand;
  }

  public handle(command: PatchFinishedAtCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.clone();
    updatedSession.finishedAt = command.finishedAt;

    this.sessionStateHolder.set(updatedSession);

    this.sessionRepository.update(updatedSession);
  }
}
