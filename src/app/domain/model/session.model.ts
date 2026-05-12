import { ExerciseSet } from './exercise-set.model';
import { createUuid } from '../../common/function/create-uuid.function';
import { DateHelper } from '../../common/helper/date.helper';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

export class ExerciseEntry {
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
  public exerciseEntries: ExerciseEntry[] = [];
  public notes: string | null = null;
  public startedAt: TemporalType.Instant = DateHelper.now();
  public finishedAt: TemporalType.Instant | null = null;

  constructor(
    public readonly uuid: string,
    public readonly createdAt: TemporalType.Instant,
  ) {}

  public get day() {
    return this.startedAt ? DateHelper.toLocal(this.startedAt).day : -1;
  }

  public get date() {
    return this.startedAt ? DateHelper.toLocal(this.startedAt).toPlainDate().toString() : null;
  }

  public get yearMonth() {
    return this.startedAt ? DateHelper.toLocal(this.startedAt).toString().substring(0, 7) : null;
  }

  public get invalid(): boolean {
    return this.exerciseEntries.every((entry) => entry.sets.length === 0);
  }

  public static createEmpty() {
    return new Session(createUuid(), DateHelper.now());
  }

  public shallowClone(): Session {
    const session = new Session(this.uuid, this.createdAt);
    session.startedAt = this.startedAt;
    session.finishedAt = this.finishedAt;
    session.exerciseEntries = this.exerciseEntries;
    return session;
  }

  public addExerciseEntry(exerciseId: string): Session {
    if (this.exerciseEntries.some((exerciseSet) => exerciseSet.exerciseId === exerciseId)) return this;

    this.exerciseEntries = [...this.exerciseEntries, new ExerciseEntry(exerciseId)];
    return this.shallowClone();
  }

  public removeExerciseEntry(exerciseId: string): void {
    this.exerciseEntries = this.exerciseEntries.filter(
      (exerciseEntry) => exerciseEntry.exerciseId !== exerciseId,
    );
  }

  public setExerciseNotes(exerciseId: string, notes: string | null): void {
    const exerciseEntry = this.getExerciseEntryByExerciseId(exerciseId);
    exerciseEntry.notes = notes;
  }

  public addSet(exerciseId: string, set: ExerciseSet): Session {
    const exerciseEntry = this.getExerciseEntryByExerciseId(exerciseId);
    exerciseEntry.addSet(set);
    return this.shallowClone();
  }

  public removeSet(exerciseId: string, index: number): Session {
    const exerciseEntry = this.getExerciseEntryByExerciseId(exerciseId);
    exerciseEntry.removeSetAt(index);
    return this.shallowClone();
  }

  public updateSet(exerciseId: string, index: number, set: ExerciseSet): void {
    const exerciseEntry = this.getExerciseEntryByExerciseId(exerciseId);
    exerciseEntry.updateSet(set, index);
  }

  private getExerciseEntryByExerciseId(exerciseId: string): ExerciseEntry {
    const exerciseEntry = this.exerciseEntries.find((entry) => entry.exerciseId === exerciseId);

    if (!exerciseEntry) throw new Error(`Exercise Entry for exercise ID: ${exerciseId} not found`);

    return exerciseEntry;
  }
}
