import { inject, Injectable } from '@angular/core';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { EditExerciseNoteCommand } from './edit-exercise-note.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '../../routers/event-bus';
import { ExerciseLogUpdatedEvent } from '../../events/exercise-log-updated/exercise-log-updated.event';

@Injectable()
export class EditExerciseNoteCommandHandler implements CommandHandler<EditExerciseNoteCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): CommandConstructor<EditExerciseNoteCommand> {
    return EditExerciseNoteCommand;
  }

  public handle({ notes, exerciseId }: EditExerciseNoteCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const updatedSession = session.setExerciseNotes(exerciseId, notes);
    this.sessionStateHolder.set(updatedSession);

    const updatedExerciseLog = updatedSession.getExerciseById(exerciseId);
    this.eventBus.dispatch(new ExerciseLogUpdatedEvent(updatedExerciseLog));
  }
}
