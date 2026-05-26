import { inject, Injectable } from '@angular/core';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { CopySetCommand } from '../../copy-set.command';
import { SessionStateHolder } from '../../../store/session-state-holder.store';
import { SetIdProvider } from '../../../services/set-id-provider/set-id-provider.service';
import { EventBus } from '../../../routers/event-bus';
import { SetCreatedEvent } from '../../../events/set-created.event';

@Injectable()
export class CopySetCommandHandler implements CommandHandler<CopySetCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);
  private readonly setIdProvider = inject(SetIdProvider);

  public appliesTo(): CommandConstructor<CopySetCommand> {
    return CopySetCommand;
  }

  public handle({ set }: CopySetCommand): void {
    const session = this.sessionStateHolder.session();

    if (session === null) throw new Error('Session is null');

    const exercise = session.getExerciseById(set.exerciseId);
    const copiedSet = exercise.cloneSetAtIndex(set.index);
    copiedSet.id = this.setIdProvider.nextSetId();

    this.eventBus.dispatch(new SetCreatedEvent(copiedSet));

    this.sessionStateHolder.set(session.addSet(copiedSet));
  }
}
