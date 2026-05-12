export class Exercise {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly description: string | null,
  ) {}
}

export const isExercise = (value: unknown): value is Exercise =>
  value !== null &&
  typeof value === 'object' &&
  'uuid' in value &&
  'name' in value
