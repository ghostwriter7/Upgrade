import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SessionEditorService } from '../services/session-editor.service';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-actions',
  imports: [MatFabButton, MatIcon],
  templateUrl: './session-actions.html',
  styleUrl: './session-actions.css',
})
export class SessionActions {
  private readonly sessionEditor = inject(SessionEditorService);
  private readonly router = inject(Router);

  protected readonly isEditable = this.sessionEditor.$isEditable;
  protected readonly isUnfinished = this.sessionEditor.$isUnfinished;
  protected readonly isSessionInvalid = this.sessionEditor.$isSessionInvalid;

  protected completeSession(): void {
    this.sessionEditor.completeSession();
    this.router.navigate(['/session', this.sessionEditor.$session().isoDate]);
  }

  protected cancelEdit(): void {
    this.sessionEditor.cancelEdit();
  }

  protected showExerciseDialog(): void {
    this.sessionEditor.showExerciseDialog();
  }
}
