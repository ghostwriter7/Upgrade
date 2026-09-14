import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { inject, Injectable } from '@angular/core';
import { DeleteSetCommand } from './delete-set.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@angular/cdk/schematics';
import { SetRepository } from '@persistence/repository/set.repository';

@Injectable()
export class DeleteSetCommandHandler implements CommandHandler<DeleteSetCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): Constructor<DeleteSetCommand> {
    return DeleteSetCommand;
  }

  public handle({ set }: DeleteSetCommand): void {
    const session = this.sessionStateHolder.session()!;

    const updatedSession = session.removeSet(set);

    const id = set.id;
    if (id) {
      this.setRepository.deleteById(id);
    }

    const affectedSets = updatedSession.getExerciseById(set.exerciseId).sets.slice(set.index);
    if (affectedSets.length) {
      this.setRepository.updateMany(affectedSets);
    }

    this.sessionStateHolder.set(updatedSession);
  }
}
