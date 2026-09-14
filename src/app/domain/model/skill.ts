
export interface Skill {
  id: string;
  name: string;
  capabilities: SkillCapability[];
}

export interface SkillCapability {
  capabilityId: string;
  label: string;
  importance: number;
}
