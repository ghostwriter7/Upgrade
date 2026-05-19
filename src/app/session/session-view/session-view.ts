import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionHeader } from '../session-header/session-header';
import { Temporal as TemporalType } from '@js-temporal/polyfill';
import { Timer } from '../timer/timer';
import { DialogService } from '../../common/service/dialog/dialog.service';
import { SessionEditorService } from '../services/session-editor.service';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionActions } from '../session-actions/session-actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [
    ReactiveFormsModule,
    SessionHeader,
    Timer,
    ExerciseCard,
    SessionActions,
  ],
  providers: [DialogService, SessionEditorService],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  public isNew = input(false);

  private readonly sessionEditor = inject(SessionEditorService);

  protected readonly editedSession = this.sessionEditor.$session;

  protected onStartedAtChange(startedAt: TemporalType.Instant): void {
    this.sessionEditor.patchStartedAt(startedAt);
  }

  protected onFinishedAtChange(finishedAt: TemporalType.Instant): void {
    this.sessionEditor.patchFinishedAt(finishedAt);
  }

  protected onEditStart(): void {
    this.sessionEditor.makeEditable();
  }
}
