import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '../../routers/event-bus';
import { Session } from '../../../domain/model/session.model';
import { EditExerciseNoteCommandHandler } from './edit-exercise-note-command.handler';
import { EditExerciseNoteCommand } from './edit-exercise-note.command';
import { ExerciseLogUpdatedEvent } from '../../events/exercise-log-updated/exercise-log-updated.event';

describe('EditExerciseNoteCommandHandler', () => {
  let eventBus: { dispatch: Mock };
  let sessionStateHolder: { session: Mock; set: Mock };
  let handler: EditExerciseNoteCommandHandler;

  beforeEach(() => {
    eventBus = { dispatch: vi.fn() };
    sessionStateHolder = { session: vi.fn(), set: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        EditExerciseNoteCommandHandler,
      ],
    });

    handler = TestBed.inject(EditExerciseNoteCommandHandler);
  });

  test('should edit a note for an exercise log', () => {
    const command = new EditExerciseNoteCommand('note', 'exerciseId');
    const session = Session.createEmpty().addExercise('exerciseId');
    const expectedSession = session.clone();
    expectedSession.setExerciseNotes('exerciseId', 'note');
    const exerciseLog = expectedSession.exercises[0];
    sessionStateHolder.session.mockReturnValueOnce(session);

    handler.handle(command);

    expect(sessionStateHolder.set).toHaveBeenCalledWith(expectedSession);
    expect(eventBus.dispatch).toHaveBeenCalledExactlyOnceWith(
      new ExerciseLogUpdatedEvent(exerciseLog),
    );
  });
});
