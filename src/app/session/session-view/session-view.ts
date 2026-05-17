import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionHeader } from '../session-header/session-header';
import { Temporal as TemporalType } from '@js-temporal/polyfill';
import { MatIcon } from '@angular/material/icon';
import { Timer } from '../timer/timer';
import { DialogService } from '../../common/service/dialog.service';
import { SessionEditorService } from '../services/session-editor.service';
import { ExerciseCard } from '../exercise-card/exercise-card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [
    ReactiveFormsModule,
    SessionHeader,
    MatIcon,
    Timer,
    MatFabButton,
    ExerciseCard,
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
  protected readonly isUnfinished = this.sessionEditor.$isUnfinished;

  private readonly router = inject(Router);

  protected showExerciseDialog(): void {
    this.sessionEditor.showExerciseDialog();
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

  protected onEditStart(): void {
    this.sessionEditor.makeEditable();
  }

  protected cancelEdit(): void {
    this.sessionEditor.cancelEdit();
  }
}
