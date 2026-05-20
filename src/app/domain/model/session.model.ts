import { ExerciseSet } from './exercise-set.model';
import { createUuid } from '../../common/function/create-uuid.function';
import { DateHelper } from '../../common/helper/date.helper';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

export class ExerciseLog {
  public sets: ExerciseSet[] = [];
  public notes: string | null = null;
  public mediaIds: string[] = [];

  constructor(public readonly exerciseId: string) {}

  public get isEmpty(): boolean {
    return this.sets.length === 0;
  }

  public get hasMedia(): boolean {
    return this.mediaIds.length > 0;
  }

  public clone(): ExerciseLog {
    const log = new ExerciseLog(this.exerciseId);
    log.sets = this.sets;
    log.notes = this.notes;
    log.mediaIds = this.mediaIds;
    return log;
  }

  public withMedia(mediaId: string): ExerciseLog {
    this.mediaIds = [...this.mediaIds, mediaId];
    return this.clone();
  }

  public withSet(set: ExerciseSet): ExerciseLog {
    this.sets = [...this.sets, set];
    return this.clone();
  }

  public removeSetAt(index: number): ExerciseLog {
    this.checkIndex(index);
    this.sets = this.sets.toSpliced(index, 1);
    return this.clone();
  }

  public withUpdatedSet(set: ExerciseSet, index: number): ExerciseLog {
    this.checkIndex(index);
    this.sets = this.sets.with(index, set);
    return this.clone();
  }

  public withNotes(notes: string | null): ExerciseLog {
    this.notes = notes;
    return this.clone();
  }

  private checkIndex(index: number): void {
    if (index < 0 || index >= this.sets.length) {
      throw new Error('Invalid index');
    }
  }
}

export class Session {
  public exercises: ExerciseLog[] = [];
  public notes: string | null = null;
  public startedAt: TemporalType.Instant = DateHelper.now();
  public finishedAt: TemporalType.Instant | null = null;

  constructor(
    public readonly uuid: string,
    public readonly createdAt: TemporalType.Instant,
  ) {}

  public get dayOfMonth(): number {
    return DateHelper.toLocal(this.startedAt).day;
  }

  public get isoDate(): string {
    return DateHelper.toLocal(this.startedAt).toPlainDate().toString();
  }

  public get isEmpty(): boolean {
    return this.exercises.every((entry) => entry.sets.length === 0);
  }

  public static createEmpty(): Session {
    return new Session(createUuid(), DateHelper.now());
  }

  /**
   * Performs a shallow clone of the session, creating a new instance with the same properties.
   */
  public clone(): Session {
    const session = new Session(this.uuid, this.createdAt);
    session.startedAt = this.startedAt;
    session.finishedAt = this.finishedAt;
    session.exercises = [...this.exercises];
    return session;
  }

  public addExercise(exerciseId: string): Session {
    if (this.exercises.some((exerciseSet) => exerciseSet.exerciseId === exerciseId)) return this;
    this.exercises = [...this.exercises, new ExerciseLog(exerciseId)];
    return this.clone();
  }

  public addMediaToExercise(exerciseId: string, mediaId: string): Session {
    const exerciseIndex = this.getExerciseIndex(exerciseId);
    const exerciseLog = this.exercises[exerciseIndex];
    this.exercises = this.exercises.with(exerciseIndex, exerciseLog.withMedia(mediaId));
    return this.clone();
  }

  public removeExercise(exerciseId: string): Session {
    this.exercises = this.exercises.filter(
      (exerciseEntry) => exerciseEntry.exerciseId !== exerciseId,
    );
    return this.clone();
  }

  public setExerciseNotes(exerciseId: string, notes: string | null): Session {
    const index = this.getExerciseIndex(exerciseId);
    this.exercises = this.exercises.with(index, this.exercises[index].withNotes(notes));
    return this.clone();
  }

  public addSet(exerciseId: string, set: ExerciseSet): Session {
    const index = this.getExerciseIndex(exerciseId);
    this.exercises = this.exercises.with(index, this.exercises[index].withSet(set));
    return this.clone();
  }

  public copySet(exerciseId: string, index: number): Session {
    const exerciseIndex = this.getExerciseIndex(exerciseId);
    const exercise = this.exercises[exerciseIndex];
    const set = exercise.sets[index];

    if (index < 0 || index >= exercise.sets.length) throw new Error('Invalid set index');

    this.exercises = this.exercises.with(exerciseIndex, exercise.withSet(set));
    return this.clone();
  }

  public copyLastSet(exerciseId: string): Session {
    const index = this.getExerciseIndex(exerciseId);
    const exercise = this.exercises[index];
    const lastSet = exercise.sets.at(-1);

    if (!lastSet) throw new Error('Exercise has no sets to copy');

    this.exercises = this.exercises.with(index, exercise.withSet(lastSet));
    return this.clone();
  }


    public removeSet(exerciseId: string, index: number): Session {
    const exerciseIndex = this.getExerciseIndex(exerciseId);
    this.exercises = this.exercises.with(exerciseIndex, this.exercises[exerciseIndex].removeSetAt(index));
    return this.clone();
  }

  public updateSet(exerciseId: string, index: number, set: ExerciseSet): Session {
    const exerciseIndex = this.getExerciseIndex(exerciseId);
    this.exercises = this.exercises.with(
      exerciseIndex,
      this.exercises[exerciseIndex].withUpdatedSet(set, index),
    );
    return this.clone();
  }

  private getExerciseIndex(exerciseId: string): number {
    const index = this.exercises.findIndex((entry) => entry.exerciseId === exerciseId);
    if (index === -1) throw new Error(`Exercise with ID: ${exerciseId} not found`);
    return index;
  }

  public getExerciseById(exerciseId: string): ExerciseLog {
    const exerciseEntry = this.exercises.find((entry) => entry.exerciseId === exerciseId);

    if (!exerciseEntry) throw new Error(`Exercise Entry for exercise ID: ${exerciseId} not found`);

    return exerciseEntry;
  }
}
