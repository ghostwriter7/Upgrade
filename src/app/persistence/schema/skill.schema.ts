import { z } from 'zod';
import { json } from '@persistence/schema/json.schema';
import { ExerciseSetTypes } from '@domain/model/exercise-set/exercise-set.model';

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
  unitsOfMeasurement: json(z.array(z.enum(ExerciseSetTypes)).nullable()),
});

export const ExerciseCapabilitySchema = z.object({
  exerciseId: z.string(),
  capabilityId: z.string(),
  weight: z.number(),
});
