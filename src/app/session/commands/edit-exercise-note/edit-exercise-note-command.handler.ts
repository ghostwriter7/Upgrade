import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { EditExerciseNoteCommand } from './edit-exercise-note.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@common/types/constructor.type';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';

@Injectable()
export class EditExerciseNoteCommandHandler implements CommandHandler<EditExerciseNoteCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): Constructor<EditExerciseNoteCommand> {
    return EditExerciseNoteCommand;
  }

  public handle({ notes, exerciseId }: EditExerciseNoteCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.setExerciseNotes(exerciseId, notes);
    this.sessionStateHolder.set(updatedSession);

    const updatedExerciseLog = updatedSession.getExerciseById(exerciseId);
    this.exerciseLogRepository.update(updatedExerciseLog);
  }
}
