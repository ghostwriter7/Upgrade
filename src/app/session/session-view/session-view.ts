import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ExerciseStore } from '../../store/exercises.store';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExerciseEntry, Session } from '../../domain/model/session.model';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ExerciseNamePipe } from '../../ui/pipes/exercise-name-pipe';
import { SetView } from '../set-view/set-view';
import { AddSetForm } from '../add-set-form/add-set-form';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { MatList, MatListItem } from '@angular/material/list';
import { SessionStore } from '../../store/session.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    ExerciseNamePipe,
    SetView,
    AddSetForm,
    MatList,
    MatListItem,
    MatCardHeader,
  ],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  private readonly exerciseStore = inject(ExerciseStore);
  private readonly sessionStore = inject(SessionStore);

  protected readonly availableExercises = computed(() => {
    const activeExerciseIds = this.activeExerciseIds();
    const allExercises = this.exerciseStore.exercises();
    return allExercises.filter(({ uuid }) => !activeExerciseIds.has(uuid));
  });
  protected readonly exerciseControl = new FormControl<string | null>(null, [Validators.required]);
  protected readonly hasLeftExercises = computed(() => this.availableExercises().length > 0);
  protected readonly editedSession = signal<Session>(Session.createEmpty());

  private readonly activeExerciseIds = signal<Set<string>>(new Set());
  protected readonly isSessionInvalid = computed(() => this.editedSession().exerciseEntries
    .every((entry) => entry.sets.length === 0));

  private readonly exerciseEntries = signal<ExerciseEntry[]>([]);

  protected addExerciseEntry(): void {
    const { value } = this.exerciseControl;

    if (value) {
      this.activeExerciseIds.update((ids) => new Set([...ids, value]));
      this.editedSession().addExerciseEntry(value);
    }
  }

  protected handleNewSet(set: ExerciseSet, exerciseId: string): void {
    this.editedSession().addSet(exerciseId, set);
  }

  protected deleteSet(exerciseId: string, index: number): void {
    this.editedSession().removeSet(exerciseId, index);
  }

  protected editSet(exerciseId: string, set: ExerciseSet, index: number): void {

  }

  protected completeSession(): void {
    const session = this.editedSession();
    session.finishedAt = new Date().toISOString();
    session.startedAt = new Date().toISOString();
    this.sessionStore.save(session);
  }
}
