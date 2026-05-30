import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CommandBus } from '../../routers/command-bus';
import { CompleteSessionCommand } from '../../commands/complete-session/complete-session.command';
import { ExerciseSelector } from '../exercise-selector/exercise-selector';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { AddExerciseCommand } from '../../commands/add-exercise/add-exercise.command';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-actions',
  imports: [MatFabButton, MatIcon],
  templateUrl: './session-actions.html',
  styleUrl: './session-actions.css',
})
export class SessionActions {
  private readonly router = inject(Router);
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly commandBus = inject(CommandBus);

  protected readonly isUnfinished = this.sessionStateHolder.isUnfinished;
  protected readonly isSessionInvalid = this.sessionStateHolder.isSessionInvalid;

  private readonly dialogService = inject(DialogService);

  protected completeSession(): void {
    this.commandBus.dispatch(new CompleteSessionCommand());
    this.router.navigate(['/session', this.sessionStateHolder.session()!.isoDate]);
  }

  protected cancelEdit(): void {
    this.router.navigate(['/session', this.sessionStateHolder.session()!.isoDate]);
  }

  protected showExerciseDialog(): void {
    this.dialogService.open(
      ExerciseSelector,
      (exerciseIds: string[]) => this.commandBus.dispatch(new AddExerciseCommand(exerciseIds)),
      { data: { session: this.sessionStateHolder.session() }, width: '90svw', height: '80svh' },
    );
  }
}
