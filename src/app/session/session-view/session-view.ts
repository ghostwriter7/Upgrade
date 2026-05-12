import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { DateHelper } from '../../common/helper/date.helper';
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
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

type ExerciseData = {
  exerciseId: string;
  sets: ExerciseSet[];
}[];

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
    MatFabButton,
  ],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  public session = input.required<Session>();

  private readonly exerciseStore = inject(ExerciseStore);
  private readonly sessionStore = inject(SessionStore);

  protected readonly editedSession = linkedSignal(() => this.session());
  protected readonly availableExercises = computed(() => {
    const activeExerciseIds = this.activeExerciseIds();
    const allExercises = this.exerciseStore.exercises();
    return allExercises.filter(({ uuid }) => !activeExerciseIds.has(uuid));
  });
  protected readonly exerciseField = form(signal({ exerciseId: '' }), (schema) => {
    required(schema.exerciseId);
  });
  protected readonly hasLeftExercises = computed(() => this.availableExercises().length > 0);
  protected readonly isSessionInvalid = computed(() => this.editedSession().invalid);
  protected readonly isEditable = computed(() => !this.session().finishedAt);
  protected readonly startedAt = computed(() =>
    DateHelper.toLocal(this.session().startedAt).toLocaleString('en-GB', { timeStyle: 'short' }),
  );
  private readonly activeExerciseIds = computed(
    () => new Set(this.editedSession().exerciseEntries.map(({ exerciseId }) => exerciseId)),
  );
  protected readonly finishedAt = computed(() => {
    const finishedAt = this.editedSession()?.finishedAt;
    return finishedAt
      ? DateHelper.toLocal(finishedAt).toLocaleString('en-GB', { timeStyle: 'short' })
      : null;
  });
  protected readonly duration = computed(() => {
    const { startedAt, finishedAt } = this.editedSession();

    if (!finishedAt) return null;

    const duration = DateHelper.toLocal(finishedAt).since(DateHelper.toLocal(startedAt));
    const { hours, minutes } = duration;

    if (hours) return `${hours}h ${minutes}m`;

    return `${minutes}m`;
  });

  private readonly router = inject(Router);

  protected addExerciseEntry(): void {
    const exerciseId = this.exerciseField.exerciseId().value();

    if (exerciseId) {
      this.editedSession.update((session) => session.addExerciseEntry(exerciseId));
    }
  }

  protected addSet(set: ExerciseSet, exerciseId: string): void {
    this.editedSession.update((session) => session.addSet(exerciseId, set));
  }

  protected deleteSet(exerciseId: string, index: number): void {
    this.editedSession.update((session) => session.removeSet(exerciseId, index));
  }

  protected editSet(exerciseId: string, set: ExerciseSet, index: number): void {}

  protected deleteSession(): void {}

  protected completeSession(): void {
    const session = this.editedSession();
    session.finishedAt = DateHelper.now();

    this.sessionStore.save(session);
    this.router.navigate(['/session', session.date]);
  }
}
