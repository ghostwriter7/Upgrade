import { ExerciseSet } from './exercise-set.model';
import { createNanoId } from '@common/function/create-uuid.function';

export class ExerciseLog {
  public sets: ExerciseSet[] = [];
  public notes: string | null = null;
  public index: number = 0;

  constructor(
    public readonly sessionId: string,
    public readonly exerciseId: string,
    public readonly id: string = createNanoId(),
  ) {}

  public get isEmpty(): boolean {
    return this.sets.length === 0;
  }

  public hasAllEqualSet(): boolean {
    if (this.sets.length === 0 || this.sets.length === 1) return true;

    for (let i = 0; i < this.sets.length - 1; i++) {
      const currentSet = this.sets[i];
      const nextSet = this.sets[i + 1];

      if (!currentSet.isEqual(nextSet)) return false;
    }

    return true;
  }

  public computeSetSummary(): string[] {
    if (this.isEmpty) return [];

    if (this.hasAllEqualSet()) return [`${this.sets.length} x ${this.sets[0].print()}`];

    return this.sets.map((set) => set.print());
  }

  public clone(): ExerciseLog {
    const log = new ExerciseLog(this.sessionId, this.exerciseId, this.id);
    log.sets = this.sets;
    log.notes = this.notes;
    log.index = this.index;
    return log;
  }

  public cloneSetAtIndex(index: number): ExerciseSet {
    const set = this.sets.at(index);
    if (!set) {
      throw new Error(`Set at index ${index} does not exist`);
    }

    return set.clone().withIndex(this.sets.length);
  }

  public withIndex(index: number): ExerciseLog {
    const clone = this.clone();
    clone.index = index;
    return clone;
  }

  public withSet(set: ExerciseSet): ExerciseLog {
    this.sets = [...this.sets, set];
    return this.clone();
  }

  public removeSetAt(index: number): ExerciseLog {
    this.checkIndex(index);
    for (let i = index + 1; i < this.sets.length; i++) {
      this.sets[i].index--;
    }
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
