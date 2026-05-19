import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AddSetForm } from '../add-set-form/add-set-form';
import { ExerciseNamePipe } from '../../ui/pipes/exercise-name-pipe';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatMiniFabButton } from '@angular/material/button';
import { SetView } from '../set-view/set-view';
import { ExerciseLog } from '../../domain/model/session.model';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { SessionEditorService } from '../services/session-editor.service';
import { EventService } from '../../common/service/event/event.service';
import { ElementClickedEvent } from '../../common/events/element-clicked.event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-exercise-card',
  imports: [
    AddSetForm,
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
  public entry = input.required<ExerciseLog>();
  public isNonDeletable = input.required<boolean>();

  private readonly sessionEditor = inject(SessionEditorService);
  protected readonly isEditable = this.sessionEditor.$isEditable;
  protected readonly setFormActiveForExerciseId = this.sessionEditor.$setFormActiveForExerciseId;
  protected readonly displayActions = signal(false);
  private readonly header = viewChild.required(MatCardHeader, { read: ElementRef });
  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);

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
    this.sessionEditor.showSetFormForExerciseId(exerciseId);
  }

  protected copyLastSet(event: Event, exerciseId: string): void {
    event.stopPropagation();
    this.sessionEditor.copyLastSet(exerciseId);
  }

  protected editExerciseNote(event: Event, exerciseLog: ExerciseLog): void {
    event.stopPropagation();
    this.sessionEditor.editExerciseNote(exerciseLog);
  }

  protected deleteExercise(event: Event, exerciseLog: ExerciseLog): void {
    event.stopPropagation();
    this.sessionEditor.deleteExercise(exerciseLog);
  }

  protected addSet($event: ExerciseSet, exerciseId: string): void {
    this.sessionEditor.addSet($event, exerciseId);
  }

  protected onCancelAddSet(): void {
    this.sessionEditor.cancelAddSet();
  }

  protected activateActions(): void {
    if (this.isEditable()) {
      this.displayActions.set(true);
    }
  }

  protected async activateVideoCapture(event: Event, exerciseId: string): Promise<void> {
    event.stopPropagation();
    this.sessionEditor.captureRecording(exerciseId);
  }
}
