export const ExerciseSetTypes = ['bodyweight', 'weight', 'iso'] as const;
export type ExerciseSetType = (typeof ExerciseSetTypes)[number];

export abstract class ExerciseSet {
  public id?: string;

  protected constructor(
    public readonly sessionId: string,
    public readonly exerciseId: string,
    public readonly type: ExerciseSetType,
    public index: number,
  ) {}

  public abstract get quantity(): number;

  public abstract clone(): ExerciseSet;

  public withIndex(index: number): ExerciseSet {
    this.index = index;
    return this.clone();
  }

  public abstract isEqual(other: ExerciseSet): boolean;

  public abstract print(): string;
}

export class BodyweightSet extends ExerciseSet {
  constructor(
    sessionId: string,
    exerciseId: string,
    index: number,
    public readonly reps: number,
  ) {
    super(sessionId, exerciseId, 'bodyweight', index);
  }

  public get quantity(): number {
    return this.reps;
  }

  public clone(): ExerciseSet {
    return new BodyweightSet(this.sessionId, this.exerciseId, this.index, this.reps);
  }

  public override isEqual(other: ExerciseSet): boolean {
    return other instanceof BodyweightSet && other.reps === this.reps;
  }

  public override print(): string {
    return `${this.reps}`;
  }
}

export class WeightedSet extends ExerciseSet {
  constructor(
    sessionId: string,
    exerciseId: string,
    index: number,
    public readonly reps: number,
    public readonly weight: number,
  ) {
    super(sessionId, exerciseId, 'weight', index);
  }

  public get quantity(): number {
    return this.reps;
  }

  public clone(): ExerciseSet {
    return new WeightedSet(this.sessionId, this.exerciseId, this.index, this.reps, this.weight);
  }

  public override isEqual(other: ExerciseSet) {
    return other instanceof WeightedSet && other.reps === this.reps && other.weight === this.weight;
  }

  public override print(): string {
    return `${this.reps}+${this.weight}kg`;
  }
}

export class IsoSet extends ExerciseSet {
  constructor(
    sessionId: string,
    exerciseId: string,
    index: number,
    public readonly duration: number,
    public readonly weight?: number,
  ) {
    super(sessionId, exerciseId, 'iso', index);
  }

  public get quantity(): number {
    return this.duration;
  }

  public clone(): ExerciseSet {
    return new IsoSet(this.sessionId, this.exerciseId, this.index, this.duration, this.weight);
  }

  public override isEqual(other: ExerciseSet): boolean {
    return (
      other instanceof IsoSet && other.weight === this.weight && other.duration === this.duration
    );
  }

  public override print(): string {
    if (!this.weight) return `${this.duration}s`;
    return `${this.duration}s+${this.weight}kg`;
  }
}

export abstract class ExerciseSetBuilder {
  protected sessionId?: string;
  protected exerciseId?: string;
  protected id?: string;
  protected index?: number;

  protected constructor(protected readonly type: ExerciseSetType) {}

  public abstract build(): ExerciseSet;

  public withSessionId(sessionId: string): this {
    this.sessionId = sessionId;
    return this;
  }

  public withExerciseId(exerciseId: string): this {
    this.exerciseId = exerciseId;
    return this;
  }

  public withId(id?: string): this {
    this.id = id;
    return this;
  }

  public withIndex(index: number): this {
    this.index = index;
    return this;
  }

  protected requireSessionId(): string {
    if (this.sessionId === undefined) {
      throw new Error(`${this.type} set requires sessionId`);
    }

    return this.sessionId;
  }

  protected requireExerciseId(): string {
    if (this.exerciseId === undefined) {
      throw new Error(`${this.type} set requires exerciseId`);
    }

    return this.exerciseId;
  }

  protected requireIndex(): number {
    if (this.index === undefined) {
      throw new Error(`${this.type} set requires index`);
    }

    return this.index;
  }

  protected applyId<T extends ExerciseSet>(set: T): T {
    if (this.id !== undefined) {
      set.id = this.id;
    }

    return set;
  }
}

export class BodyweightSetBuilder extends ExerciseSetBuilder {
  private reps?: number;

  constructor() {
    super('bodyweight');
  }

  public build(): BodyweightSet {
    if (this.reps === undefined || this.reps === 0) {
      throw new Error('bodyweight set requires reps');
    }

    return this.applyId(
      new BodyweightSet(
        this.requireSessionId(),
        this.requireExerciseId(),
        this.requireIndex(),
        this.reps,
      ),
    );
  }

  public withReps(reps: number): this {
    this.reps = reps;
    return this;
  }
}

export class IsoSetBuilder extends ExerciseSetBuilder {
  private duration?: number;
  private weight?: number;

  constructor() {
    super('iso');
  }

  public build(): IsoSet {
    if (this.duration === undefined || this.duration === 0) {
      throw new Error('iso set requires duration');
    }

    return this.applyId(
      new IsoSet(
        this.requireSessionId(),
        this.requireExerciseId(),
        this.requireIndex(),
        this.duration,
        this.weight,
      ),
    );
  }

  public withDuration(duration: number): this {
    this.duration = duration;
    return this;
  }

  public withWeight(weight?: number): this {
    this.weight = weight;
    return this;
  }
}

export class WeightSetBuilder extends ExerciseSetBuilder {
  private weight?: number;
  private reps?: number;

  constructor() {
    super('weight');
  }

  public withWeight(weight: number): this {
    this.weight = weight;
    return this;
  }

  public withReps(reps: number): this {
    this.reps = reps;
    return this;
  }

  public build(): WeightedSet {
    if (this.reps === undefined || this.reps === 0) {
      throw new Error('weight set requires reps');
    }

    if (this.weight === undefined || this.weight === 0) {
      throw new Error('weight set requires weight');
    }

    return this.applyId(
      new WeightedSet(
        this.requireSessionId(),
        this.requireExerciseId(),
        this.requireIndex(),
        this.reps,
        this.weight,
      ),
    );
  }
}
