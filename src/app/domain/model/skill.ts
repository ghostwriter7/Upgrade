import { CapabilityId } from '@store/capabilities.const';

export interface Skill {
  id: string;
  name: string;
  capabilities: SkillCapability[];
}

export interface SkillCapability {
  capabilityId: CapabilityId;
  importance: number;
}

export const capability = (capabilityId: CapabilityId, importance: number): SkillCapability => ({
  capabilityId,
  importance,
});
