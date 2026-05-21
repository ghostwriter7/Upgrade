import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, skip, tap } from 'rxjs';
import { SessionStore } from '../../store/session/session.store';
import { SESSION } from '../consts/session.token';
import { ExerciseSelector } from '../exercise-selector/exercise-selector';
import { DialogService } from '../../common/service/dialog/dialog.service';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { EditSet } from '../edit-set/edit-set';
import { DateHelper } from '../../common/helper/date.helper';
import { Temporal as TemporalType } from '@js-temporal/polyfill';
import { ExerciseLog, Session } from '../../domain/model/session.model';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { EditNote } from '../edit-note/edit-note';
import { Recorder } from '../recorder/recorder';
import { ExerciseMedia } from '../../domain/model/exercise-media.model';
import { MediaRepository } from '../../persistence/repository/media.repository';

@Injectable()
export class SessionEditorService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionStore = inject(SessionStore);
  private readonly mediaRepository = inject(MediaRepository);
  private readonly dialog = inject(DialogService);
  private readonly initialSession = inject(SESSION, { optional: true }) ?? Session.createEmpty();
  private readonly sessionDraft = signal(this.initialSession);
  private readonly isEditable = signal(!this.initialSession.finishedAt);
  private readonly setFormActiveForExerciseId = signal<string | null>(null);

  public readonly $session = this.sessionDraft.asReadonly();
  public readonly $isEditable = this.isEditable.asReadonly();
  public readonly $isSessionInvalid = computed(() => this.sessionDraft().isEmpty);
  public readonly $setFormActiveForExerciseId = this.setFormActiveForExerciseId.asReadonly();
  public readonly $isUnfinished = computed(() => !this.sessionDraft().finishedAt);

  constructor() {
    toObservable(this.sessionDraft)
      .pipe(
        skip(1),
        filter((session) => !session.isEmpty),
        debounceTime(1000),
        tap((session) => this.sessionStore.save(session)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public addSet(set: ExerciseSet, exerciseId: string): void {
    this.sessionDraft.update((session) => session.addSet(exerciseId, set));
    this.setFormActiveForExerciseId.set(null);
  }

  public deleteSet(exerciseId: string, index: number): void {
    this.sessionDraft.update((session) => session.removeSet(exerciseId, index));
  }

  public editSet(exerciseId: string, set: ExerciseSet, index: number): void {
    this.dialog.open(
      EditSet,
      (result: ExerciseSet) =>
        this.sessionDraft.update((session) => session.updateSet(exerciseId, index, result)),
      { data: { set } },
    );
  }

  public completeSession(): void {
    this.sessionDraft.update((session) => {
      session.finishedAt = DateHelper.now();
      return session.clone();
    });
    this.sessionStore.save(this.sessionDraft());
    this.isEditable.set(false);
  }

  public patchStartedAt(startedAt: TemporalType.Instant): void {
    this.sessionDraft.update((session) => {
      session.startedAt = startedAt;
      return session.clone();
    });
  }

  public patchFinishedAt(finishedAt: TemporalType.Instant): void {
    this.sessionDraft.update((session) => {
      session.finishedAt = finishedAt;
      return session.clone();
    });
  }

  public deleteExercise(entry: ExerciseLog): void {
    this.dialog.open(ConfirmDeleteAlert, () => {
      const exercise = this.sessionDraft().getExerciseById(entry.exerciseId);
      if (exercise.hasMedia) {
        exercise.mediaIds.forEach((mediaId) => this.mediaRepository.deleteMedia(mediaId));
      }
      this.sessionDraft.update((session) => session.removeExercise(entry.exerciseId));
    });
  }

  public editExerciseNote(entry: ExerciseLog): void {
    this.dialog.open(
      EditNote,
      (note: string) =>
        this.sessionDraft.update((session) => session.setExerciseNotes(entry.exerciseId, note)),
      {
        data: { note: entry.notes },
        width: '90svw',
        height: '90svh',
      },
      (note: string | undefined) => typeof note === 'string',
    );
  }

  public showExerciseDialog(): void {
    this.dialog.open(
      ExerciseSelector,
      (exerciseIds: Set<string>) => {
        if (exerciseIds.size !== 0) {
          exerciseIds.forEach((exerciseId) => {
            this.sessionDraft.update((session) => session.addExercise(exerciseId));
          });
        }
      },
      { data: { session: this.sessionDraft() }, width: '90svw', height: '80svh' },
    );
  }

  public showSetFormForExerciseId(exerciseId: string): void {
    this.setFormActiveForExerciseId.set(exerciseId);
  }

  public copyLastSet(exerciseId: string): void {
    this.sessionDraft.update((session) => session.copyLastSet(exerciseId));
  }

  public makeEditable(): void {
    this.isEditable.set(true);
  }

  public cancelEdit(): void {
    this.isEditable.set(false);
  }

  public cancelAddSet(): void {
    this.setFormActiveForExerciseId.set(null);
  }

  public copySet(exerciseId: string, index: number): void {
    this.sessionDraft.update((session) => session.copySet(exerciseId, index));
  }

  public captureRecording(exerciseId: string): void {
    this.dialog.open(
      Recorder,
      ({ image, width, height }: { image: Blob; width: number; height: number }) => {
        const sessionId = this.sessionDraft().uuid;

        const media = ExerciseMedia.newImage(exerciseId, sessionId, image, width, height);
        this.mediaRepository.save(media);
        this.sessionDraft.update((session) =>
          session.addMediaToExercise(exerciseId, media.uuid),
        );
      },
      {
        width: '90svw',
        height: '90svh',
      },
    );
  }
}
