import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { MatButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { DateHelper } from '../../common/helper/date.helper';
import { ReactiveFormsModule } from '@angular/forms';
import { ExerciseLog, Session } from '../../domain/model/session.model';
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
import { EditSet } from '../edit-set/edit-set';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { EditNote } from '../edit-note/edit-note';
import { Timer } from '../timer/timer';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';

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
    MatMenu,
    MatMenuTrigger,
    MatList,
    MatListItem,
    MatCardHeader,
    SessionHeader,
    MatIcon,
    MatMiniFabButton,
    MatMenuItem,
    Timer,
    MatFabButton,
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
    const ref: MatDialogRef<ExerciseSelector, Set<string> | undefined> = this.dialog.open(
      ExerciseSelector,
      { data: { session: this.editedSession() }, width: '90svw', height: '80svh' },
    );

    ref
      .afterClosed()
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
    this.editedSession.update((session) => session.removeSet(exerciseId, index));
  }

  protected editSet(exerciseId: string, set: ExerciseSet, index: number): void {
    const ref: MatDialogRef<EditSet, ExerciseSet | undefined> = this.dialog.open(EditSet, {
      data: { set },
    });
    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.editedSession.update((session) => session.updateSet(exerciseId, index, result));
        }
      });
  }

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

  protected deleteExercise(entry: ExerciseLog): void {
    const ref = this.dialog.open(ConfirmDeleteAlert);

    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.editedSession.update((session) => session.removeExercise(entry.exerciseId));
        }
      });

  }

  protected editExerciseNote(entry: ExerciseLog): void {
    const ref = this.dialog.open(EditNote, {
      data: { note: entry.notes },
      width: '90svw',
      height: '90svh',
    });
    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((note: string | null) => {
        if (typeof note === 'string') {
          this.editedSession.update((session) => session.setExerciseNotes(entry.exerciseId, note));
        }
      });
  }
}
