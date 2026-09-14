import { z } from 'zod';

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const SkillCapabilitySchema = z.object({
  skillId: z.string(),
  capabilityId: z.string(),
  importance: z.number(),
});

export const CapabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastPerformedAt: z.iso.datetime().nullable(),
});

export const ExerciseCapabilitySchema = z.object({
  exerciseId: z.string(),
  capabilityId: z.string(),
  weight: z.number(),
});
