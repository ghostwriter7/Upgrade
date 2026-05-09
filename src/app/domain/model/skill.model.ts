export class Skill {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly createdAt: string,
    public readonly updatedAt: string | null,
  ) {}
}

export const isSkill = (value: unknown): value is Skill =>
  value !== null &&
  typeof value === 'object' &&
  'uuid' in value &&
  'name' in value &&
  'createdAt' in value;
