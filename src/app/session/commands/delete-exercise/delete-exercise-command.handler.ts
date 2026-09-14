import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { DeleteExerciseCommand } from './delete-exercise.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@common/types/constructor.type';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';

@Injectable()
export class DeleteExerciseCommandHandler implements CommandHandler<DeleteExerciseCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

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
    this.exerciseLogRepository.deleteLog(removedLog.id);
    this.exerciseLogRepository.updateLogs(reIndexedLogs);
  }
}
