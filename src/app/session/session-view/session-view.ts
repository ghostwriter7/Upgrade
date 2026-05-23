import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionHeader } from '../session-header/session-header';
import { Timer } from '../timer/timer';
import { DialogService } from '../../common/service/dialog/dialog.service';
import { SessionEditorService } from '../services/session-editor.service';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionActions } from '../session-actions/session-actions';
import { SESSION } from '../consts/session.token';
import { SessionStore } from '../../store/session/session.store';
import { Session } from '../../domain/model/session.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [ReactiveFormsModule, SessionHeader, Timer, ExerciseCard, SessionActions],
  providers: [
    DialogService,
    {
      provide: SESSION,
      useFactory: () =>
        inject(SESSION, { optional: true, skipSelf: true }) ??
        inject(SessionStore).editedSession() ??
        Session.createEmpty(),
    },

    SessionEditorService,
  ],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  public isNew = input(false);

  private readonly sessionEditor = inject(SessionEditorService);
  private readonly sessionStore = inject(SessionStore);

  protected readonly editedSession = this.sessionEditor.$session;
  protected readonly isEditable = this.sessionEditor.$isEditable;

  private readonly route = inject(ActivatedRoute);

  constructor() {
    const isEditable = this.route.snapshot.url.some((urlSegment) => urlSegment.path === 'edit');
    if (isEditable) {
      this.sessionEditor.makeEditable();
      inject(DestroyRef).onDestroy(() => this.sessionStore.setEditedSession(null));
    }
  }
}
