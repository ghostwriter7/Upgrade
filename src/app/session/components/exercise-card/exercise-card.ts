import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ExerciseNamePipe } from '../../../ui/pipes/exercise-name-pipe';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatMiniFabButton } from '@angular/material/button';
import { SetView } from '../set-view/set-view';
import { ExerciseLog } from '../../../domain/model/session.model';
import { EventService } from '../../../common/service/event/event.service';
import { ElementClickedEvent } from '../../../common/events/element-clicked.event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EntryDetails } from '../entry-details/entry-details';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { CommandBus } from '../../routers/command-bus';
import { CreateSetCommand } from '../../commands/create-set.command';
import { SetData } from '../set-form/set-data.interface';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { DeleteExerciseCommand } from '../../commands/delete-exercise.command';
import { EditNote } from '../edit-note/edit-note';
import { EditExerciseNoteCommand } from '../../commands/edit-exercise-note.command';
import { Recorder } from '../recorder/recorder';
import { CaptureRecordingCommand } from '../../commands/capture-recording.command';
import { UpsertSetDialogData } from '../upsert-set/upsert-set-dialog-data.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-exercise-card',
  imports: [
    ExerciseNamePipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatList,
    MatListItem,
    MatMiniFabButton,
    SetView,
  ],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.css',
})
export class ExerciseCard {
  public isEditable = input(false);
  public entry = input.required<ExerciseLog>();
  public isNonDeletable = input.required<boolean>();

  protected readonly testIds = computed(() => {
    const uuid = this.entry().exerciseId;
    return {
      exerciseCardHeader: `exercise-card-header-${uuid}`,
      showSetFormButton: `exercise-card-show-set-form-btn-${uuid}`,
      editNoteButton: `exercise-card-edit-note-btn-${uuid}`,
      deleteButton: `exercise-card-delete-btn-${uuid}`,
    };
  });

  protected readonly displayActions = signal(false);
  private readonly header = viewChild.required(MatCardHeader, { read: ElementRef });
  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly hasMedia = computed(() => this.entry().mediaIds.length);

  private readonly bottomSheetService = inject(MatBottomSheet);
  private readonly commandBus = inject(CommandBus);
  private readonly dialogService = inject(DialogService);

  constructor() {
    this.eventService
      .listen(ElementClickedEvent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ element }) => {
        if (!(this.header().nativeElement as HTMLElement).contains(element)) {
          this.displayActions.set(false);
        }
      });
  }

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

  protected activateActions(): void {
    if (this.isEditable()) {
      this.displayActions.set(true);
    }
  }

  protected async activateVideoCapture(event: Event, exerciseId: string): Promise<void> {
    event.stopPropagation();
    this.dialogService.open(
      Recorder,
      ({ image, width, height }: { image: Blob; width: number; height: number }) =>
        this.commandBus.dispatch(new CaptureRecordingCommand(image, width, height, exerciseId)),
      {
        width: '90svw',
        height: '90svh',
      },
    );
  }

  protected showMedia(): void {
    this.bottomSheetService.open(EntryDetails, {
      data: { exerciseLog: this.entry() },
      height: '80svh',
    });
  }
}
