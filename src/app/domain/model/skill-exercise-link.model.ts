export class SkillExerciseLink {
  constructor(
    public readonly uuid: string,
    public readonly skillUuid: string,
    public readonly exerciseUuid: string,
  ) {}
}
