import { inject, Injectable } from '@angular/core';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { DeleteExerciseCommand } from './delete-exercise.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '../../routers/event-bus';
import { MediaDeletedEvent } from '../../events/media-deleted/media-deleted.event';
import { ExerciseLogDeletedEvent } from '../../events/exercise-log-deleted/exercise-log-deleted.event';
import { ExerciseLogUpdatedEvent } from '../../events/exercise-log-updated/exercise-log-updated.event';

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

    const {
      session: updatedSession,
      reIndexedLogs,
      removedLog,
    } = session.removeExerciseLog(exerciseId);

    if (removedLog.hasMedia) {
      removedLog.mediaIds.forEach((mediaId) =>
        this.eventBus.dispatch(new MediaDeletedEvent(mediaId)),
      );
    }

    this.sessionStateHolder.set(updatedSession);
    this.eventBus.dispatch(new ExerciseLogDeletedEvent(removedLog));
    reIndexedLogs.forEach((log) => this.eventBus.dispatch(new ExerciseLogUpdatedEvent(log)))
  }
}
