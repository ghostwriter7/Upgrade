import { ExerciseSet } from './exercise-set.model';
import { createUuid } from '../../common/function/create-uuid.function';

export class ExerciseLog {
  public sets: ExerciseSet[] = [];
  public notes: string | null = null;
  public mediaIds: string[] = [];

  constructor(
    public readonly sessionId: string,
    public readonly exerciseId: string,
    public readonly id: string = createUuid(),
  ) {}

  public get isEmpty(): boolean {
    return this.sets.length === 0;
  }

  public get hasMedia(): boolean {
    return this.mediaIds.length > 0;
  }

  public clone(): ExerciseLog {
    const log = new ExerciseLog(this.sessionId, this.exerciseId, this.id);
    log.sets = this.sets;
    log.notes = this.notes;
    log.mediaIds = this.mediaIds;
    return log;
  }

  public cloneSetAtIndex(index: number): ExerciseSet {
    const set = this.sets.at(index);
    if (!set) {
      throw new Error(`Set at index ${index} does not exist`);
    }

    return set.clone().withIndex(this.sets.length);
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
