import { Provider } from '@angular/core';
import { COMMAND_HANDLERS } from '@common/routers/command/command-handlers.token';
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
import { CaptureProgressCommandHandler } from '@session/commands/capture-progress/capture-progress-command.handler';
import { DeleteSessionCommandHandler } from './delete-session/delete-session-command.handler';
import { CreateSessionCommandHandler } from './create-session/create-session-command.handler';
import { DownloadImageCommandHandler } from '@session/commands/download-image/download-image-command.handler';
import { CreateFromTemplateCommandHandler } from '@session/commands/create-from-template/create-from-template-command.handler';
import { UpdateSessionRpeCommandHandler } from '@session/commands/update-session-rpe/update-session-rpe-command.handler';

export class CommandHandlerProvider {
  public static forRoot(): Provider[] {
    return [
      DeleteSetCommandHandler,
      CopySetCommandHandler,
      UpdateSetCommandHandler,
      CreateSetCommandHandler,
      PatchStartedAtCommandHandler,
      PatchFinishedAtCommandHandler,
      CompleteSessionCommandHandler,
      DeleteSessionCommandHandler,
      CreateSessionCommandHandler,
      DeleteExerciseCommandHandler,
      AddExerciseCommandHandler,
      EditExerciseNoteCommandHandler,
      CaptureProgressCommandHandler,
      DownloadImageCommandHandler,
      CreateFromTemplateCommandHandler,
      UpdateSessionRpeCommandHandler,
    ].map((handler) => ({
      useClass: handler,
      multi: true,
      provide: COMMAND_HANDLERS,
    }));
  }
}
