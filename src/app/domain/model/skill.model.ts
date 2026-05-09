import { createUuid } from '../../common/function/create-uuid.function';

class SkillBuilder {
  private uuid: string | null = null;
  private name: string | null = null;
  private description: string | null = null;
  private createdAt: string | null = null;
  private updatedAt: string | null = null;
  private prerequisiteSkillIds: string[] = [];
  private exerciseIds: string[] = [];

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public withDescription(description: string | null): this {
    this.description = description;
    return this;
  }

  public withCreatedAt(createdAt: string): this {
    this.createdAt = createdAt;
    return this;
  }

  public withUuid(uuid: string): this {
    this.uuid = uuid;
    return this;
  }

  public withUpdatedAt(updatedAt: string): this {
    this.updatedAt = updatedAt;
    return this;
  }

  public withPrerequisiteSkillIds(prerequisiteSkillIds: string[]): this {
    this.prerequisiteSkillIds = prerequisiteSkillIds;
    return this;
  }

  public withExerciseIds(exerciseIds: string[]): this {
    this.exerciseIds = exerciseIds;
    return this;
  }

  public build(): Skill {
    if (!this.name) throw new Error('Name is required');

    return new Skill(
      this.uuid ?? createUuid(),
      this.name,
      this.description,
      this.createdAt ?? new Date().toISOString(),
      this.updatedAt,
      this.prerequisiteSkillIds,
      this.exerciseIds,
    );
  }
}

export class Skill {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly createdAt: string,
    public readonly updatedAt: string | null,
    public readonly prerequisiteSkillIds: string[] = [],
    public readonly exerciseIds: string[] = [],
  ) {}

  public static builder(): SkillBuilder {
    return new SkillBuilder();
  }

  public addPrerequisiteSkillId(skillId: string): void {
    this.prerequisiteSkillIds.push(skillId);
  }

  public addExerciseId(exerciseId: string): void {
    this.exerciseIds.push(exerciseId);
  }
}

export const isSkill = (value: unknown): value is Skill =>
  value !== null &&
  typeof value === 'object' &&
  'uuid' in value &&
  'name' in value &&
  'createdAt' in value;
