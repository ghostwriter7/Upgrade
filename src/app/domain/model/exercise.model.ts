export class Exercise {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly description?: string,
  ) {}
}
