import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionActions } from '../session-actions/session-actions';
import { SessionHeader } from '../session-header/session-header';
import { Timer } from '../timer/timer';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { SessionStore } from '../../../store/session/session.store';
import { Session } from '../../../domain/model/session.model';
import { DialogService } from '../../../common/service/dialog/dialog.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-editor',
  imports: [ExerciseCard, SessionActions, SessionHeader, Timer],
  templateUrl: './session-editor.html',
  providers: [DialogService],
  styleUrl: './session-editor.css',
})
export default class SessionEditor implements OnInit, OnDestroy {
  public isNew = input(false);

  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly sessionStore = inject(SessionStore);

  protected readonly session = this.sessionStateHolder.session;

  public ngOnInit(): void {
    if (this.isNew()) {
      this.sessionStateHolder.set(Session.createEmpty());
    }
  }

  public ngOnDestroy(): void {
    this.sessionStore.updateCache(this.sessionStateHolder.session()!);
    if (!this.isNew()) this.sessionStateHolder.set(null);
  }
}
