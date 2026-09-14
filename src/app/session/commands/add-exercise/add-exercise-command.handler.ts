import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { AddExerciseCommand } from './add-exercise.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class AddExerciseCommandHandler implements CommandHandler<AddExerciseCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): Constructor<AddExerciseCommand> {
    return AddExerciseCommand;
  }

  public handle({ exerciseIds }: AddExerciseCommand): void {
    if (exerciseIds.length !== 0) {
      const session = this.sessionStateHolder.session();

      if (!session) throw new Error('Session not found');

      const { session: updatedSession, addedLogs } = session.addExerciseLogs(exerciseIds);
      this.sessionStateHolder.set(updatedSession);

      this.exerciseLogRepository.saveLogs(addedLogs);
    }
  }
}
