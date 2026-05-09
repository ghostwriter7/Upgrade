import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ExerciseStore } from '../../store/exercises.store';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Session } from '../../domain/model/session.model';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ExerciseNamePipe } from '../../ui/pipes/exercise-name-pipe';
import { SetView } from '../set-view/set-view';
import { AddSetForm } from '../add-set-form/add-set-form';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { MatList, MatListItem } from '@angular/material/list';

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
export default class SessionView implements OnInit {
  public session = input<Session | null>(null);

  private readonly exerciseStore = inject(ExerciseStore);

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

  public ngOnInit(): void {
    const existingSession = this.session();

    if (existingSession) {
      this.activeExerciseIds.set(
        new Set(existingSession.exerciseEntries.map((entry) => entry.exerciseId)),
      );
      this.editedSession.set(existingSession);
    }
  }

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
    session.setFinishedAt(new Date().toISOString());
  }
}
