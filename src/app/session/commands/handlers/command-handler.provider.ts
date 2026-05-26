import { Provider } from '@angular/core';
import { COMMAND_HANDLERS } from './command-handlers.token';
import { DeleteSetCommandHandler } from './delete-set/delete-set-command.handler';
import { CopySetCommandHandler } from './copy-set/copy-set-command.handler';
import { UpdateSetCommandHandler } from './update-set/update-set-command.handler';
import { CreateSetCommandHandler } from './create-set/create-set-command.handler';
import { PatchStartedAtCommandHandler } from './patch-started-at/patch-started-at-command.handler';
import { PatchFinishedAtCommandHandler } from './patch-finished-at/patch-finished-at-command.handler';
import { CompleteSessionCommandHandler } from './complete-session/complete-session-command.handler';
import { DeleteExerciseCommandHandler } from './delete-exercise/delete-exercise-command.handler';
import { AddExerciseCommandHandler } from './add-exercise/add-exercise-command.handler';
import { EditExerciseNoteCommandHandler } from './edit-exercise-note/edit-exercise-note-command.handler';
import { CaptureRecordingCommandHandler } from './capture-recording/capture-recording-command.handler';

export class CommandHandlerProvider {
  public static forRoot(): Provider[] {
    return [
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: DeleteSetCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: CopySetCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: UpdateSetCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: CreateSetCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: PatchStartedAtCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: PatchFinishedAtCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: CompleteSessionCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: DeleteExerciseCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: AddExerciseCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: EditExerciseNoteCommandHandler,
      },
      {
        provide: COMMAND_HANDLERS,
        multi: true,
        useClass: CaptureRecordingCommandHandler
      }
    ];
  }
}
