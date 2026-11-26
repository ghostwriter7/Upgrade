import { Component, inject, output } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CommandBus } from '@common/routers/command/command-bus';
import { CompleteSessionCommand } from '../../commands/complete-session/complete-session.command';

@Component({
  selector: 'app-session-actions',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './session-actions.html',
  styleUrl: './session-actions.css',
})
export class SessionActions {
  public showExercises = output();

  private readonly router = inject(Router);
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly commandBus = inject(CommandBus);

  protected readonly isUnfinished = this.sessionStateHolder.isUnfinished;
  protected readonly isSessionInvalid = this.sessionStateHolder.isSessionInvalid;

  protected completeSession(): void {
    this.commandBus.dispatch(new CompleteSessionCommand());
    this.router.navigate(['/session', this.sessionStateHolder.session()!.isoDate]);
  }

  protected cancelEdit(): void {
    this.router.navigate(['/session', this.sessionStateHolder.session()!.isoDate]);
  }
}
