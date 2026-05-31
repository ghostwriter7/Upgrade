import { CommandHandler } from '../command-handler.interface';
import { inject, Injectable } from '@angular/core';
import { DeleteSetCommand } from './delete-set.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { SetUpdatedEvent } from '../../events/set-updated/set-updated.event';
import { SetDeletedEvent } from '../../events/set-deleted/set-deleted.event';
import { Constructor } from '@angular/cdk/schematics';

@Injectable()
export class DeleteSetCommandHandler implements CommandHandler<DeleteSetCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<DeleteSetCommand> {
    return DeleteSetCommand;
  }

  public handle({ set }: DeleteSetCommand): void {
    const session = this.sessionStateHolder.session()!;

    const updatedSession = session.removeSet(set);

    const id = set.id;
    if (id) {
      this.eventBus.dispatch(new SetDeletedEvent(id));
    }

    const affectedSets = updatedSession.getExerciseById(set.exerciseId).sets.slice(set.index);
    if (affectedSets.length) {
      affectedSets.forEach(set => this.eventBus.dispatch(new SetUpdatedEvent(set)));
    }

    this.sessionStateHolder.set(updatedSession);
  }
}
