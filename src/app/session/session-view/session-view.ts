import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
  OnInit,
  signal,
} from '@angular/core';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
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
import { DialogService } from '../../common/service/dialog.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [
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
  providers: [DialogService],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView implements OnInit {
  public isNew = input(false);
  public session = input.required<Session>();

  private readonly sessionStore = inject(SessionStore);

  protected readonly editedSession = linkedSignal(() => this.session());
  protected readonly isSessionInvalid = computed(() => this.editedSession().isEmpty);
  protected readonly isEditable = signal(false);
  protected readonly showSetFormFor = signal<string | null>(null);
  protected readonly isUnfinished = computed(() => !this.session().finishedAt);

  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
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

  public ngOnInit(): void {
    this.isEditable.set(!this.session().finishedAt);
  }

  protected showExerciseDialog(): void {
    this.dialog.open(
      ExerciseSelector,
      (exerciseIds: Set<string>) => {
        if (exerciseIds.size !== 0) {
          exerciseIds.forEach((exerciseId) => {
            this.editedSession.update((session) => session.addExercise(exerciseId));
          });
        }
      },
      { data: { session: this.editedSession() }, width: '90svw', height: '80svh' },
    );
  }

  protected addSet(set: ExerciseSet, exerciseId: string): void {
    this.editedSession.update((session) => session.addSet(exerciseId, set));
    this.showSetFormFor.set(null);
  }

  protected deleteSet(exerciseId: string, index: number): void {
    this.editedSession.update((session) => session.removeSet(exerciseId, index));
  }

  protected editSet(exerciseId: string, set: ExerciseSet, index: number): void {
    this.dialog.open(
      EditSet,
      (result: ExerciseSet) =>
        this.editedSession.update((session) => session.updateSet(exerciseId, index, result)),
      { data: { set } },
    );
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
    this.dialog.open(ConfirmDeleteAlert, () =>
      this.editedSession.update((session) => session.removeExercise(entry.exerciseId)),
    );
  }

  protected editExerciseNote(entry: ExerciseLog): void {
    this.dialog.open(
      EditNote,
      (note: string) =>
        this.editedSession.update((session) => session.setExerciseNotes(entry.exerciseId, note)),
      {
        data: { note: entry.notes },
        width: '90svw',
        height: '90svh',
      },
      (note: string | undefined) => typeof note === 'string',
    );
  }

  protected showSetForm(exerciseId: string): void {
    this.showSetFormFor.set(exerciseId);
  }

  protected copyLastSet(exerciseId: string): void {
    this.editedSession.update((session) => session.copyLastSet(exerciseId));
  }

  protected onEditStart(): void {
    this.isEditable.set(true);
  }

  protected cancelEdit(): void {
    this.isEditable.set(false);
  }
}
