import { z } from 'zod';

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const SKillCapabilitySchema = z.object({
  skillId: z.string(),
  capabilityId: z.string(),
  importance: z.number(),
});

export const CapabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type SkillDto = z.infer<typeof SkillSchema>;
export type CapabilityDto = z.infer<typeof CapabilitySchema>;
export type SkillCapabilityDto = z.infer<typeof SKillCapabilitySchema>;
