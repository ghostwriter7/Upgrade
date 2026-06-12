import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { DeleteExerciseCommand } from './delete-exercise.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { ExerciseLogDeletedEvent } from '../../events/exercise-log-deleted/exercise-log-deleted.event';
import { ExerciseLogUpdatedEvent } from '../../events/exercise-log-updated/exercise-log-updated.event';
import { Constructor } from '@common/types/constructor.type';
import { SessionUpdatedEvent } from '@session/events/session-updated/session-updated.event';

@Injectable()
export class DeleteExerciseCommandHandler implements CommandHandler<DeleteExerciseCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<DeleteExerciseCommand> {
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

    this.sessionStateHolder.set(updatedSession);
    this.eventBus.publish(new SessionUpdatedEvent(updatedSession));
    this.eventBus.publish(new ExerciseLogDeletedEvent(removedLog));
    reIndexedLogs.forEach((log) => this.eventBus.publish(new ExerciseLogUpdatedEvent(log)));
  }
}
