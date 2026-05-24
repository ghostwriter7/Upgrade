import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, skip, tap } from 'rxjs';
import { SessionStore } from '../../store/session/session.store';
import { SESSION } from '../consts/session.token';
import { ExerciseSelector } from '../exercise-selector/exercise-selector';
import { DialogService } from '../../common/service/dialog/dialog.service';
import { BodyweightSetBuilder, ExerciseSet } from '../../domain/model/exercise-set.model';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { DateHelper } from '../../common/helper/date.helper';
import { Temporal as TemporalType } from '@js-temporal/polyfill';
import { ExerciseLog } from '../../domain/model/session.model';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { EditNote } from '../edit-note/edit-note';
import { Recorder } from '../recorder/recorder';
import { ExerciseMedia } from '../../domain/model/exercise-media.model';
import { MediaRepository } from '../../persistence/repository/media.repository';
import { SessionRepository } from '../../persistence/repository/session.repository';
import { SetRepository } from '../../persistence/repository/set.repository';

@Injectable()
export class SessionEditorService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionStore = inject(SessionStore);
  private readonly setRepository = inject(SetRepository);
  private readonly sessionRepository = inject(SessionRepository);
  private readonly mediaRepository = inject(MediaRepository);
  private readonly dialog = inject(DialogService);
  private readonly initialSession = inject(SESSION);
  private readonly sessionDraft = signal(this.initialSession);
  private readonly isEditable = signal(false);

  public readonly $session = this.sessionDraft.asReadonly();
  public readonly $isEditable = this.isEditable.asReadonly();
  public readonly $isSessionInvalid = computed(() => this.sessionDraft().isEmpty);
  public readonly $isUnfinished = computed(() => !this.sessionDraft().finishedAt);

  constructor() {
    toObservable(this.sessionDraft)
      .pipe(
        skip(1),
        filter((session) => !session.isEmpty),
        tap((session) => this.sessionStore.updateCache(session)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public setIsEditable(isEditable: boolean): void {
    this.isEditable.set(isEditable);
  }

  public deleteSet(exerciseId: string, index: number, id: number): void {
    this.sessionDraft.update((session) => session.removeSet(exerciseId, index));
    this.setRepository.deleteSet(id);
    const affectedSets = this.sessionDraft().getExerciseById(exerciseId).sets.slice(index);
    affectedSets.forEach((set) => this.setRepository.upsertSet(set));
  }

  public editSet(set: ExerciseSet): void {
    this.dialog.open(
      UpsertSet,
      (result: ExerciseSet) => {
        result.id = set.id;
        this.sessionDraft.update((session) => session.updateSet(result));
        this.setRepository.upsertSet(result);
      },
      { data: { set } },
    );
  }

  public completeSession(): void {
    this.sessionDraft.update((session) => {
      session.finishedAt = DateHelper.now();
      return session.clone();
    });
    this.sessionStore.updateCache(this.sessionDraft());
    this.sessionRepository.save(this.sessionDraft());
    this.isEditable.set(false);
  }

  public patchStartedAt(startedAt: TemporalType.Instant): void {
    this.sessionDraft.update((session) => {
      session.startedAt = startedAt;
      return session.clone();
    });
    this.sessionRepository.save(this.sessionDraft());
  }

  public patchFinishedAt(finishedAt: TemporalType.Instant): void {
    this.sessionDraft.update((session) => {
      session.finishedAt = finishedAt;
      return session.clone();
    });
    this.sessionRepository.save(this.sessionDraft());
  }

  public deleteExercise(entry: ExerciseLog): void {
    this.dialog.open(ConfirmDeleteAlert, () => {
      const exercise = this.sessionDraft().getExerciseById(entry.exerciseId);
      if (exercise.hasMedia) {
        exercise.mediaIds.forEach((mediaId) => this.mediaRepository.deleteMedia(mediaId));
      }
      if (!exercise.isEmpty) {
        Iterator.from(exercise.sets)
          .map(({ id }) => id)
          .filter((id) => id !== undefined)
          .forEach((id) => this.setRepository.deleteSet(id));
      }
      this.sessionDraft.update((session) => session.removeExercise(entry.exerciseId));
      this.sessionRepository.save(this.sessionDraft());
    });
  }

  public editExerciseNote(entry: ExerciseLog): void {
    this.dialog.open(
      EditNote,
      (note: string) => {
        this.sessionDraft.update((session) => session.setExerciseNotes(entry.exerciseId, note));
        this.sessionRepository.save(this.sessionDraft());
      },
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
            this.sessionRepository.save(this.sessionDraft());
          });
        }
      },
      { data: { session: this.sessionDraft() }, width: '90svw', height: '80svh' },
    );
  }

  public displaySetForm(exerciseId: string): void {
    // TODO Query the ExerciseStore for the last set for the given exercise and open the form with it.
    const set = new BodyweightSetBuilder()
      .withReps(1)
      .withSessionId(this.sessionDraft().uuid)
      .withExerciseId(exerciseId)
      .withIndex(this.sessionDraft().getExerciseById(exerciseId).sets.length)
      .build();
    this.dialog.open(
      UpsertSet,
      async (result: ExerciseSet) => {
        result.id = await this.setRepository.upsertSet(result);
        this.sessionDraft.update((session) => session.addSet(exerciseId, result));
        this.sessionRepository.save(this.sessionDraft());
      },
      { data: { set, label: 'Add Set', button: 'Save' } },
    );
  }

  public async copySet(exerciseId: string, index: number): Promise<void> {
    const exercise = this.sessionDraft().getExerciseById(exerciseId);
    const set = exercise.cloneSetAtIndex(index);
    set.id = await this.setRepository.upsertSet(set);
    this.sessionDraft.update((session) => session.addSet(exerciseId, set));
  }

  public captureRecording(exerciseId: string): void {
    this.dialog.open(
      Recorder,
      ({ image, width, height }: { image: Blob; width: number; height: number }) => {
        const sessionId = this.sessionDraft().uuid;

        const media = ExerciseMedia.newImage(exerciseId, sessionId, image, width, height);
        this.mediaRepository.save(media);
        this.sessionDraft.update((session) => session.addMediaToExercise(exerciseId, media.uuid));
      },
      {
        width: '90svw',
        height: '90svh',
      },
    );
  }
}
