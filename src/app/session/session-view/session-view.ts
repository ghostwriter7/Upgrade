import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ExerciseStore } from '../../store/exercises.store';
import { ReactiveFormsModule } from '@angular/forms';
import { Session } from '../../domain/model/session.model';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ExerciseNamePipe } from '../../ui/pipes/exercise-name-pipe';
import { SetView } from '../set-view/set-view';
import { AddSetForm } from '../add-set-form/add-set-form';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { MatList, MatListItem } from '@angular/material/list';
import { SessionStore } from '../../store/session.store';
import { form, FormField, required } from '@angular/forms/signals';
import { createUuid } from '../../common/function/create-uuid.function';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

type ExerciseData =  {
  exerciseId: string;
  sets: ExerciseSet[];
}[]

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
    FormField,
    MatIcon,
    DatePipe,
    MatFabButton,
  ],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  public session = input<Session | null>(null);

  private readonly exerciseStore = inject(ExerciseStore);
  private readonly sessionStore = inject(SessionStore);

  protected readonly availableExercises = computed(() => {
    const activeExerciseIds = this.activeExerciseIds();
    const allExercises = this.exerciseStore.exercises();
    return allExercises.filter(({ uuid }) => !activeExerciseIds.has(uuid));
  });
  protected readonly exerciseField = form(signal({ exerciseId: '' }), (schema) => {
    required(schema.exerciseId);
  });
  protected readonly hasLeftExercises = computed(() => this.availableExercises().length > 0);
  protected readonly isSessionInvalid = computed(() =>
    this.exerciseDate().every((entry) => entry.sets.length === 0),
  );
  protected readonly exerciseDate = signal<ExerciseData>([]);
  protected readonly isEditable = computed(() => !this.session());
  protected readonly startedAt = computed(
    () => this.session()?.startedAt ?? new Date().toISOString(),
  );
  private readonly activeExerciseIds = computed(
    () => new Set(this.exerciseDate().map(({ exerciseId }) => exerciseId)),
  );
  protected readonly finishedAt = computed(() => this.session()?.finishedAt);
  protected readonly duration = computed(() => {
    const startedAt = this.startedAt();
    const finishedAt = this.finishedAt();

    if (!finishedAt) return null;

    const duration = Temporal.Instant.from(finishedAt).since(Temporal.Instant.from(startedAt))
    const { hours, minutes } = duration

    if (hours) return `${hours}h ${minutes}m`;

    return `${minutes}m`;
  });

  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const session = this.session();
      if (session) {
        this.exerciseDate.set(
          session.exerciseEntries.map(({ exerciseId, sets }) => ({ exerciseId, sets })),
        );
      }
    });
  }

  protected addExerciseEntry(): void {
    const exerciseId = this.exerciseField.exerciseId().value();

    if (exerciseId) {
      this.exerciseDate.update((entries) => [...entries, { exerciseId, sets: [] }]);
    }
  }

  protected addSet(set: ExerciseSet, exerciseId: string): void {
    this.exerciseDate.update((entries) => {
      const entryIndex = entries.findIndex((entry) => entry.exerciseId === exerciseId);
      const entry = entries[entryIndex];
      return entries.with(entryIndex, { ...entry, sets: [...entry.sets, set] });
    });
  }

  protected deleteSet(exerciseId: string, index: number): void {
    this.exerciseDate.update((entries) => {
      const entryIndex = entries.findIndex((entry) => entry.exerciseId === exerciseId);
      const entry = entries[entryIndex];
      return entries.with(entryIndex, { ...entry, sets: entry.sets.toSpliced(index, 1) });
    });
  }

  protected editSet(exerciseId: string, set: ExerciseSet, index: number): void {}

  protected completeSession(): void {
    const session = new Session(createUuid(), new Date().toISOString());
    session.finishedAt = new Date().toISOString();
    session.startedAt = this.startedAt();
    const exerciseData = this.exerciseDate();
    exerciseData.forEach((entry) => {
      session.addExerciseEntry(entry.exerciseId);
      entry.sets.forEach((set) => session.addSet(entry.exerciseId, set));
    });

    this.sessionStore.save(session);
    this.router.navigate(['/session', session.date]);
  }
}
