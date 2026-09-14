import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { CopySetCommand } from './copy-set.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { createNanoId } from '@common/function/create-id.function';
import { Constructor } from '@common/types/constructor.type';
import { SetRepository } from '@persistence/repository/set.repository';

@Injectable()
export class CopySetCommandHandler implements CommandHandler<CopySetCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): Constructor<CopySetCommand> {
    return CopySetCommand;
  }

  public handle({ set }: CopySetCommand): void {
    const session = this.sessionStateHolder.session();

    if (session === null) throw new Error('Session is null');

    const exercise = session.getExerciseById(set.exerciseId);
    const copiedSet = exercise.cloneSetAtIndex(set.index);
    copiedSet.id = createNanoId();

    this.setRepository.save(copiedSet);

    this.sessionStateHolder.set(session.addSet(copiedSet));
  }
}
