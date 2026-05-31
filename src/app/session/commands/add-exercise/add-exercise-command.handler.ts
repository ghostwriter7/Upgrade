import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '../command-handler.interface';
import { AddExerciseCommand } from './add-exercise.command';
import { EventBus } from '@common/routers/event/event-bus';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { ExerciseLogCreatedEvent } from '../../events/exercise-log-created/exercise-log-created.event';
import { Constructor } from '@angular/cdk/schematics';

@Injectable()
export class AddExerciseCommandHandler implements CommandHandler<AddExerciseCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<AddExerciseCommand> {
    return AddExerciseCommand;
  }

  public handle({ exerciseIds }: AddExerciseCommand): void {
    if (exerciseIds.length !== 0) {
      const session = this.sessionStateHolder.session();

      if (!session) throw new Error('Session not found');

      const { session: updatedSession, addedLogs } = session.addExerciseLogs(...exerciseIds);
      this.sessionStateHolder.set(updatedSession);

      addedLogs.forEach((exerciseLog) =>
        this.eventBus.publish(new ExerciseLogCreatedEvent(exerciseLog)),
      );
    }
  }
}
