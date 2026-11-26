import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionActions } from '../session-actions/session-actions';
import { SessionHeader } from '../session-header/session-header';
import { Timer } from '../timer/timer';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { SessionStore } from '@store/session/session.store';
import { DialogService } from '@common/service/dialog/dialog.service';
import { CommandBus } from '@common/routers/command/command-bus';
import { CreateSessionCommand } from '../../commands/create-session/create-session-command';
import { AddExercisesComponent } from '@session/components/add-exercises/add-exercises.component';
import { LibraryStore } from '@store/library.store';
import { ExerciseOption } from '@session/components/add-exercises/add-exercises.models';
import { AddExerciseCommand } from '@session/commands/add-exercise/add-exercise.command';

@Component({
  selector: 'app-session-editor',
  imports: [ExerciseCard, SessionActions, SessionHeader, Timer, AddExercisesComponent],
  templateUrl: './session-editor.html',
  providers: [DialogService],
  styleUrl: './session-editor.css',
})
export default class SessionEditor implements OnInit, OnDestroy {
  public isNew = input(false);

  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly sessionStore = inject(SessionStore);
  private readonly libraryStore = inject(LibraryStore);
  private readonly commandBus = inject(CommandBus);
  protected readonly showAddExercises = signal(false);

  protected readonly currentExerciseIds = computed<readonly string[]>(
    () => this.session()?.exerciseIds ?? [],
  );
  protected readonly exercises = computed<ExerciseOption[]>(() => {
    const activeExercises = this.libraryStore.activeExercises();
    const currentExerciseIds = this.currentExerciseIds();
    return Iterator.from(activeExercises)
      .filter(({ id }) => !currentExerciseIds.includes(id))
      .map(({ id, isFavourite, name, type, stats }) => ({
        id,
        isFavourite,
        name,
        lastPerformedAt: stats.lastPerformedAt?.epochMilliseconds ?? null,
        type,
      }))
      .toArray();
  });

  protected readonly session = this.sessionStateHolder.session;

  public ngOnInit(): void {
    if (this.isNew()) {
      this.commandBus.dispatch(new CreateSessionCommand());
    }
  }

  public ngOnDestroy(): void {
    const session = this.sessionStateHolder.session();
    if (session) {
      this.sessionStore.updateCache(session);
      if (!this.isNew()) this.sessionStateHolder.set(null);
    }
  }

  protected onAddExercises(options: readonly ExerciseOption[]) {
    this.commandBus.dispatch(new AddExerciseCommand(options.map((option) => option.id)));
    this.showAddExercises.set(false);
  }
}
