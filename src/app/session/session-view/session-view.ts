import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ExerciseLog, Session } from '../../domain/model/session.model';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ExerciseNamePipe } from '../../ui/pipes/exercise-name-pipe';
import { SetView } from '../set-view/set-view';
import { AddSetForm } from '../add-set-form/add-set-form';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { MatList, MatListItem } from '@angular/material/list';
import { Router } from '@angular/router';
import { SessionHeader } from '../session-header/session-header';
import { Temporal as TemporalType } from '@js-temporal/polyfill';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Timer } from '../timer/timer';
import { DialogService } from '../../common/service/dialog.service';
import { SessionEditorService } from '../services/session-editor.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    ExerciseNamePipe,
    SetView,
    AddSetForm,
    MatMenu,
    MatMenuTrigger,
    MatList,
    MatListItem,
    MatCardHeader,
    SessionHeader,
    MatIcon,
    MatMiniFabButton,
    MatMenuItem,
    Timer,
    MatFabButton,
  ],
  providers: [DialogService, SessionEditorService],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  public isNew = input(false);

  private readonly sessionEditor = inject(SessionEditorService);

  protected readonly editedSession = this.sessionEditor.$session;
  protected readonly isSessionInvalid = this.sessionEditor.$isSessionInvalid;
  protected readonly isEditable = this.sessionEditor.$isEditable;
  protected readonly setFormActiveForExerciseId = this.sessionEditor.$setFormActiveForExerciseId;
  protected readonly isUnfinished = this.sessionEditor.$isUnfinished;

  private readonly router = inject(Router);

  protected showExerciseDialog(): void {
    this.sessionEditor.showExerciseDialog();
  }

  protected addSet(set: ExerciseSet, exerciseId: string): void {
    this.sessionEditor.addSet(set, exerciseId);
  }

  protected deleteSet(exerciseId: string, index: number): void {
    this.sessionEditor.deleteSet(exerciseId, index);
  }

  protected editSet(exerciseId: string, set: ExerciseSet, index: number): void {
    this.sessionEditor.editSet(exerciseId, set, index);
  }

  protected completeSession(): void {
    this.sessionEditor.completeSession();
    this.router.navigate(['/session', this.editedSession().isoDate]);
  }

  protected onStartedAtChange(startedAt: TemporalType.Instant): void {
    this.sessionEditor.patchStartedAt(startedAt);
  }

  protected onFinishedAtChange(finishedAt: TemporalType.Instant): void {
    this.sessionEditor.patchFinishedAt(finishedAt);
  }

  protected deleteExercise(entry: ExerciseLog): void {
    this.sessionEditor.deleteExercise(entry);
  }

  protected editExerciseNote(entry: ExerciseLog): void {
    this.sessionEditor.editExerciseNote(entry);
  }

  protected showSetForm(exerciseId: string): void {
    this.sessionEditor.showSetFormForExerciseId(exerciseId);
  }

  protected copyLastSet(exerciseId: string): void {
    this.sessionEditor.copyLastSet(exerciseId);
  }

  protected onEditStart(): void {
    this.sessionEditor.makeEditable();
  }

  protected cancelEdit(): void {
    this.sessionEditor.cancelEdit();
  }

  protected onCancelAddSet(): void {
    this.sessionEditor.cancelAddSet();
  }
}
