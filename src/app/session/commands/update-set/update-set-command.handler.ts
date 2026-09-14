import { inject, Injectable } from '@angular/core';
import { UpdateSetCommand } from './update-set.command';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@common/types/constructor.type';
import { SetRepository } from '@persistence/repository/set.repository';

@Injectable()
export class UpdateSetCommandHandler implements CommandHandler<UpdateSetCommand> {
  private readonly setRepository = inject(SetRepository);
  private readonly sessionStateHolder = inject(SessionStateHolder);

  public appliesTo(): Constructor<UpdateSetCommand> {
    return UpdateSetCommand;
  }

  public handle(command: UpdateSetCommand): void {
    const session = this.sessionStateHolder.session();

    if (session === null) throw new Error('Session is null');

    this.sessionStateHolder.set(session.updateSet(command.set));
    this.setRepository.update(command.set);
  }
}
