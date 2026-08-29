import { CapabilityId } from '@store/capabilities.const';
import { Skills } from '@domain/enum/skill-tag.enum';

export interface Skill {
  id: Skills;
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
