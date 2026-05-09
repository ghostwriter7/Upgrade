export interface Skill {
  uuid: string;
  name: string;
  description?: string | null;
}

export const isSkill = (value: unknown): value is Skill =>
  value !== null && typeof value === 'object' && 'uuid' in value && 'name' in value;
