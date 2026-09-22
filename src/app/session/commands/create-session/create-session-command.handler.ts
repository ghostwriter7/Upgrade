import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CreateSessionCommand } from './create-session-command';
import { Session } from '@domain/model/session/session.model';
import { Constructor } from '@common/types/constructor.type';
import { SessionRepository } from '@persistence/repository/session.repository';

@Injectable()
export class CreateSessionCommandHandler implements CommandHandler<CreateSessionCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<CreateSessionCommand> {
    return CreateSessionCommand;
  }

  public handle(command: CreateSessionCommand): void {
    const session = Session.createEmpty();
    session.skillId = command.skillId;
    this.sessionStateHolder.set(session);
    this.sessionRepository.save(session);
  }
}
