import { ExerciseSet } from '../exercise-set/exercise-set.model';
import { createNanoId } from '@common/function/create-uuid.function';
import { DateHelper } from '@common/helper/date.helper';
import { ExerciseLog } from '../exercise-log/exercise-log.model';

interface RemoveExerciseLogResult {
  session: Session;
  removedLog: ExerciseLog;
  reIndexedLogs: ExerciseLog[];
}

interface AddExerciseLogResult {
  session: Session;
  addedLog: ExerciseLog;
}

interface AddExerciseLogsResult {
  session: Session;
  addedLogs: ExerciseLog[];
}

export class Session {
  public exercises: ExerciseLog[] = [];
  public notes: string | null = null;
  public startedAt: Temporal.Instant = DateHelper.now();
  public finishedAt: Temporal.Instant | null = null;
  public exerciseIds: string[] = [];

  constructor(
    public readonly uuid: string,
    public readonly createdAt: Temporal.Instant,
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
    return new Session(createNanoId(), DateHelper.now());
  }

  /**
   * Performs a shallow clone of the session, creating a new instance with the same properties.
   */
  public clone(): Session {
    const session = new Session(this.uuid, this.createdAt);
    session.startedAt = this.startedAt;
    session.finishedAt = this.finishedAt;
    session.exercises = [...this.exercises.map((exercise) => exercise.clone())];
    session.exerciseIds = [...this.exerciseIds];
    return session;
  }

  public addExerciseLog(exerciseId: string): AddExerciseLogResult {
    if (this.exerciseIds.includes(exerciseId)) {
      throw new Error(`Exercise with ID '${exerciseId}' already exists in session.`);
    }

    const clone = this.clone();

    const log = new ExerciseLog(clone.uuid, exerciseId).withIndex(clone.exercises.length);
    clone.exercises = [...clone.exercises, log];
    clone.exerciseIds = [...clone.exerciseIds, exerciseId];

    return {
      session: clone,
      addedLog: log,
    };
  }

  public addExerciseLogs(exerciseIds: string[]): AddExerciseLogsResult {
    if (exerciseIds.length === 0) {
      throw new Error('At least one exercise ID must be provided to add exercise logs.');
    }

    if (this.exerciseIds.some((exerciseId) => exerciseIds.includes(exerciseId))) {
      throw new Error('One or more exercise IDs already exist in the session.');
    }

    const clone = this.clone();
    let index = clone.exercises.length;
    const addedLogs: ExerciseLog[] = exerciseIds.reduce(
      (logs, exerciseId) => [...logs, new ExerciseLog(clone.uuid, exerciseId).withIndex(index++)],
      [] as ExerciseLog[],
    );

    clone.exercises = [...clone.exercises, ...addedLogs];
    clone.exerciseIds = [...clone.exerciseIds, ...exerciseIds];

    return {
      session: clone,
      addedLogs,
    };
  }

  public removeExerciseLog(exerciseId: string): RemoveExerciseLogResult {
    const index = this.getExerciseIndex(exerciseId);
    const cloned = this.clone();

    const reIndexedLogs: ExerciseLog[] = [];
    for (let i = index + 1; i < cloned.exercises.length; i++) {
      const log = cloned.exercises[i];
      log.index--;
      reIndexedLogs.push(log);
    }

    const removedLog = cloned.exercises[index];
    cloned.exercises = cloned.exercises.toSpliced(index, 1);
    cloned.exerciseIds = cloned.exerciseIds.filter((id) => id !== exerciseId);
    return {
      session: cloned,
      removedLog,
      reIndexedLogs: reIndexedLogs,
    };
  }

  public setExerciseNotes(exerciseId: string, notes: string | null): Session {
    const index = this.getExerciseIndex(exerciseId);
    this.exercises = this.exercises.with(index, this.exercises[index].withNotes(notes));
    return this.clone();
  }

  public addSet(set: ExerciseSet): Session {
    const index = this.getExerciseIndex(set.exerciseId);
    this.exercises = this.exercises.with(index, this.exercises[index].withSet(set));
    return this.clone();
  }

  public removeSet(set: ExerciseSet): Session {
    const exerciseIndex = this.getExerciseIndex(set.exerciseId);
    this.exercises = this.exercises.with(
      exerciseIndex,
      this.exercises[exerciseIndex].removeSetAt(set.index),
    );
    return this.clone();
  }

  public updateSet(set: ExerciseSet): Session {
    const exerciseIndex = this.getExerciseIndex(set.exerciseId);
    const exercise = this.exercises[exerciseIndex];
    const setIndex = exercise.sets.findIndex(({ id }) => set.id === id);
    if (setIndex === -1)
      throw new Error(`Set with ID: ${set.id} not found in exercise ${exercise.exerciseId}`);

    this.exercises = this.exercises.with(exerciseIndex, exercise.withUpdatedSet(set, setIndex));
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
