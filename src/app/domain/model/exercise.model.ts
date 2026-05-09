export class Exercise {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}

export const isExercise = (value: unknown): value is Exercise =>
  value !== null &&
  typeof value === 'object' &&
  'uuid' in value &&
  'name' in value &&
  'createdAt' in value;
