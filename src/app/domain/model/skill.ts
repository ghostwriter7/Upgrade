
export interface Skill {
  id: string;
  name: string;
  capabilities: SkillCapability[];
}

export interface SkillCapability {
  capabilityId: string;
  importance: number;
}
