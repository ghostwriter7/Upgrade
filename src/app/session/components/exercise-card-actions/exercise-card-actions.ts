import { Component, computed, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { Recorder } from '../recorder/recorder';
import { CaptureRecordingCommand } from '../../commands/capture-recording/capture-recording.command';
import { CommandBus } from '@common/routers/command/command-bus';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { SetData } from '../set-form/set-data.interface';
import { CreateSetCommand } from '../../commands/create-set/create-set.command';
import { UpsertSetDialogData } from '../upsert-set/upsert-set-dialog-data.interface';
import { EditExerciseNoteCommand } from '../../commands/edit-exercise-note/edit-exercise-note.command';
import { EditNote } from '../edit-note/edit-note';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { DeleteExerciseCommand } from '../../commands/delete-exercise/delete-exercise.command';
import { MeasureProgress } from '../measure-progress/measure-progress';
import { ExerciseLog } from '../../../domain/model/exercise-log.model';

@Component({
  selector: 'app-exercise-card-actions',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './exercise-card-actions.html',
  styleUrl: './exercise-card-actions.css',
})
export class ExerciseCardActions {
  public entry = input.required<ExerciseLog>();
  public isNonDeletable = input.required<boolean>();

  private readonly commandBus = inject(CommandBus);
  private readonly dialogService = inject(DialogService);

  protected readonly testIds = computed(() => {
    const uuid = this.entry().exerciseId;
    return {
      showSetFormButton: `exercise-card-actions-show-set-form-btn-${uuid}`,
      editNoteButton: `exercise-card-actions-edit-note-btn-${uuid}`,
      deleteButton: `exercise-card-actions-delete-btn-${uuid}`,
      videoCaptureButton: `exercise-card-actions-video-capture-btn-${uuid}`,
    };
  });

  protected showSetForm(event: Event, exerciseId: string): void {
    event.stopPropagation();
    this.dialogService.open(
      UpsertSet,
      (setData: SetData) => this.commandBus.dispatch(new CreateSetCommand(setData, exerciseId)),
      {
        data: {
          set: { type: 'bodyweight', reps: 1, weight: 0, duration: 0 },
          label: 'Add Set',
          button: 'Save',
        } as UpsertSetDialogData,
      },
    );
  }

  protected editNote(event: Event, exerciseLog: ExerciseLog): void {
    event.stopPropagation();
    this.dialogService.open(
      EditNote,
      (note: string) =>
        this.commandBus.dispatch(new EditExerciseNoteCommand(note, exerciseLog.exerciseId)),
      {
        data: { note: exerciseLog.notes },
        width: '90svw',
        height: '90svh',
      },
      (note: string | undefined) => typeof note === 'string',
    );
  }

  protected deleteExercise(event: Event, exerciseLog: ExerciseLog): void {
    event.stopPropagation();
    this.dialogService.open(ConfirmDeleteAlert, () =>
      this.commandBus.dispatch(new DeleteExerciseCommand(exerciseLog.exerciseId)),
    );
  }

  protected async activateVideoCapture(event: Event, exerciseId: string): Promise<void> {
    event.stopPropagation();
    this.dialogService.open(
      MeasureProgress,
      ({ image, width, height }: { image: Blob; width: number; height: number }) =>
        this.commandBus.dispatch(new CaptureRecordingCommand(image, width, height, exerciseId)),
      {
        width: '90svw',
        height: '90svh',
      },
    );
  }
}
