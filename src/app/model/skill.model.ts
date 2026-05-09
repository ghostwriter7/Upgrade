export interface Skill {
  uuid: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export const isSkill = (value: unknown): value is Skill =>
  value !== null && typeof value === 'object' && 'uuid' in value && 'name' in value;
