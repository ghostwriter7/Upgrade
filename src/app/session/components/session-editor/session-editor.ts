import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionActions } from '../session-actions/session-actions';
import { SessionHeader } from '../session-header/session-header';
import { Timer } from '../timer/timer';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { SessionStore } from '@store/session/session.store';
import { DialogService } from '@common/service/dialog/dialog.service';
import { CommandBus } from '@common/routers/command/command-bus';
import { CreateSessionCommand } from '../../commands/create-session/create-session-command';

@Component({
  selector: 'app-session-editor',
  imports: [ExerciseCard, SessionActions, SessionHeader, Timer],
  templateUrl: './session-editor.html',
  providers: [DialogService],
  styleUrl: './session-editor.css',
})
export default class SessionEditor implements OnInit, OnDestroy {
  public isNew = input(false);
  public skillId = input<string>();

  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly sessionStore = inject(SessionStore);
  private readonly commandBus = inject(CommandBus);

  protected readonly session = this.sessionStateHolder.session;

  public ngOnInit(): void {
    if (this.isNew()) {
      this.commandBus.dispatch(new CreateSessionCommand(this.skillId()));
    }
  }

  public ngOnDestroy(): void {
    const session = this.sessionStateHolder.session();
    if (session) {
      this.sessionStore.updateCache(session);
      if (!this.isNew()) this.sessionStateHolder.set(null);
    }
  }
}
