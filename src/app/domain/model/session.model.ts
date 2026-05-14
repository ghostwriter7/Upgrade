import { ExerciseSet } from './exercise-set.model';
import { createUuid } from '../../common/function/create-uuid.function';
import { DateHelper } from '../../common/helper/date.helper';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

export class ExerciseLog {
  public sets: ExerciseSet[] = [];
  public notes: string | null = null;

  constructor(public readonly exerciseId: string) {}

  public addSet(set: ExerciseSet): void {
    this.sets = [...this.sets, set];
  }

  public removeSetAt(index: number): void {
    this.checkIndex(index);
    this.sets = this.sets.toSpliced(index, 1);
  }

  public updateSet(set: ExerciseSet, index: number): void {
    this.checkIndex(index);
    this.sets = this.sets.with(index, set);
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
    session.exercises = this.exercises;
    return session;
  }

  public addExercise(exerciseId: string): Session {
    if (this.exercises.some((exerciseSet) => exerciseSet.exerciseId === exerciseId)) return this;
    this.exercises = [...this.exercises, new ExerciseLog(exerciseId)];
    return this.clone();
  }

  public removeExercise(exerciseId: string): Session {
    this.exercises = this.exercises.filter(
      (exerciseEntry) => exerciseEntry.exerciseId !== exerciseId,
    );
    return this.clone();
  }

  public setExerciseNotes(exerciseId: string, notes: string | null): Session {
    this.getExerciseById(exerciseId).notes = notes;
    this.exercises = [...this.exercises];
    return this.clone();
  }

  public addSet(exerciseId: string, set: ExerciseSet): Session {
    this.getExerciseById(exerciseId).addSet(set);
    return this.clone();
  }

  public removeSet(exerciseId: string, index: number): Session {
    this.getExerciseById(exerciseId).removeSetAt(index);
    return this.clone();
  }

  public updateSet(exerciseId: string, index: number, set: ExerciseSet): Session {
    this.getExerciseById(exerciseId).updateSet(set, index);
    return this.clone();
  }

  private getExerciseById(exerciseId: string): ExerciseLog {
    const exerciseEntry = this.exercises.find((entry) => entry.exerciseId === exerciseId);

    if (!exerciseEntry) throw new Error(`Exercise Entry for exercise ID: ${exerciseId} not found`);

    return exerciseEntry;
  }
}
