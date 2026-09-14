import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { CompleteSessionCommand } from './complete-session.command';
import { DateHelper } from '@common/helper/date.helper';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@common/types/constructor.type';
import { SessionRepository } from '@persistence/repository/session.repository';

@Injectable()
export class CompleteSessionCommandHandler implements CommandHandler<CompleteSessionCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<CompleteSessionCommand> {
    return CompleteSessionCommand;
  }

  public handle(command: CompleteSessionCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.clone();
    updatedSession.finishedAt = DateHelper.now();

    this.sessionStateHolder.set(updatedSession);
    this.sessionRepository.update(updatedSession);
  }
}
