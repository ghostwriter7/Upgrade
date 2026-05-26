import { inject, Injectable } from '@angular/core';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { DeleteExerciseCommand } from '../../delete-exercise.command';
import { SessionStateHolder } from '../../../store/session-state-holder.store';
import { EventBus } from '../../../routers/event-bus';
import { SetDeletedEvent } from '../../../events/set-deleted.event';
import { SessionUpdatedEvent } from '../../../events/session-updated.event';
import { MediaDeletedEvent } from '../../../events/media-deleted.event';

@Injectable()
export class DeleteExerciseCommandHandler implements CommandHandler<DeleteExerciseCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): CommandConstructor<DeleteExerciseCommand> {
    return DeleteExerciseCommand;
  }

  public handle({ exerciseId }: DeleteExerciseCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const exercise = session.getExerciseById(exerciseId);
    if (exercise.hasMedia) {
      exercise.mediaIds.forEach((mediaId) =>
        this.eventBus.dispatch(new MediaDeletedEvent(mediaId)),
      );
    }
    if (!exercise.isEmpty) {
      Iterator.from(exercise.sets)
        .map(({ id }) => id)
        .filter((id) => id !== undefined)
        .forEach((id) => this.eventBus.dispatch(new SetDeletedEvent(id)));
    }

    const updatedSession = session.removeExercise(exerciseId);
    this.sessionStateHolder.set(updatedSession);
    this.eventBus.dispatch(new SessionUpdatedEvent(updatedSession));
  }
}
