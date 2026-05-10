import { ExerciseSet } from './exercise-set.model';
import { createUuid } from '../../common/function/create-uuid.function';

export class ExerciseEntry {
  public sets: ExerciseSet[] = [];
  public notes: string | null = null;

  constructor(
    public readonly exerciseId: string,
  ) {}

  public addSet(set: ExerciseSet): void {
    this.sets.push(set)
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
  public startedAt: string | null = null;
  public finishedAt: string | null = null;

  constructor(
    public readonly uuid: string,
    public readonly createdAt: string,
  ) {}

  public static createEmpty() {
    return new Session(createUuid(), new Date().toISOString());
  }

  public addExerciseEntry(exerciseId: string): void {
    if (this.exerciseEntries.some((exerciseSet) => exerciseSet.exerciseId === exerciseId))
      return;

    this.exerciseEntries.push(new ExerciseEntry(exerciseId));
  }

  public removeExerciseEntry(exerciseId: string): void {
    this.exerciseEntries = this.exerciseEntries.filter((exerciseEntry) => exerciseEntry.exerciseId !== exerciseId);
  }

  public setExerciseNotes(exerciseId: string, notes: string | null): void {
    const exerciseEntry = this.getExerciseEntryByExerciseId(exerciseId);
    exerciseEntry.notes = notes;
  }

  public addSet(exerciseId: string, set: ExerciseSet): void {
    const exerciseEntry = this.getExerciseEntryByExerciseId(exerciseId);
    exerciseEntry.addSet(set);
  }

  public removeSet(exerciseId: string, index: number): void {
    const exerciseEntry = this.getExerciseEntryByExerciseId(exerciseId);
    exerciseEntry.removeSetAt(index);
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
