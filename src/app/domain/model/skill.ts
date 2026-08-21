import { CapabilityId } from '@store/capabilities.const';

export interface Skill {
  name: string;
  capabilities: SkillCapability[];
}

export interface SkillCapability {
  capabilityId: CapabilityId;
  importance: number;
}
