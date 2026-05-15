import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { DateHelper } from '../../common/helper/date.helper';
import { ReactiveFormsModule } from '@angular/forms';
import { Session } from '../../domain/model/session.model';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ExerciseNamePipe } from '../../ui/pipes/exercise-name-pipe';
import { SetView } from '../set-view/set-view';
import { AddSetForm } from '../add-set-form/add-set-form';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { MatList, MatListItem } from '@angular/material/list';
import { SessionStore } from '../../store/session/session.store';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, skip, tap } from 'rxjs';
import { SessionHeader } from '../session-header/session-header';
import { Temporal as TemporalType } from '@js-temporal/polyfill';
import { ExerciseSelector } from '../exercise-selector/exercise-selector';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [
    MatButton,
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
    SessionHeader,
  ],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  public isNew = input(false);
  public session = input.required<Session>();

  private readonly sessionStore = inject(SessionStore);

  protected readonly editedSession = linkedSignal(() => this.session());
  protected readonly isSessionInvalid = computed(() => this.editedSession().isEmpty);
  protected readonly isEditable = computed(() => !this.session().finishedAt);

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    toObservable(this.editedSession)
      .pipe(
        skip(1),
        filter((session) => !session.isEmpty),
        debounceTime(1000),
        tap((session) => this.sessionStore.save(session)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected showExerciseDialog(): void {
    const ref: MatDialogRef<ExerciseSelector, Set<string> | undefined> = this.dialog.open(ExerciseSelector,
      { data: { session: this.editedSession() }, width: '90svw', height: '80svh' });

    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((exerciseIds) => {
        if (exerciseIds && exerciseIds.size !== 0) {
          exerciseIds.forEach((exerciseId) => {
            this.editedSession.update((session) => session.addExercise(exerciseId));
          });
        }
      });
  }

  protected addSet(set: ExerciseSet, exerciseId: string): void {
    this.editedSession.update((session) => session.addSet(exerciseId, set));
  }

  protected deleteSet(exerciseId: string, index: number): void {
    this.editedSession.update((session) =>session.removeSet(exerciseId, index));
  }

  protected editSet(exerciseId: string, set: ExerciseSet, index: number): void {}

  protected completeSession(): void {
    this.editedSession.update((session) => {
      session.finishedAt = DateHelper.now();
      return session.clone();
    });

    const session = this.editedSession();
    this.sessionStore.save(session);
    this.router.navigate(['/session', session.isoDate]);
  }

  protected onStartedAtChange(startedAt: TemporalType.Instant): void {
    this.editedSession.update((session) => {
      session.startedAt = startedAt;
      return session.clone();
    });
  }

  protected onFinishedAtChange(finishedAt: TemporalType.Instant): void {
    this.editedSession.update((session) => {
      session.finishedAt = finishedAt;
      return session.clone();
    });
  }
}
