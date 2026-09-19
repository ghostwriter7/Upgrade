import { z } from 'zod';
import { json } from '@persistence/schema/json.schema';
import { ExerciseSetTypes } from '@domain/model/exercise-set/exercise-set.model';

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  exerciseIds: json(z.array(z.string())),
  isFavourite: z.preprocess((value) => value === 1, z.boolean()),
});

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastPerformedAt: z.iso.datetime().nullable(),
  unitsOfMeasurement: json(z.array(z.enum(ExerciseSetTypes)).nullable()),
  isFavourite: z.preprocess((val) => val === 1, z.boolean()),
  skillIds: json(z.array(z.string())),
});

export type ExerciseDto = z.infer<typeof ExerciseSchema>;
export type SkillDto = z.infer<typeof SkillSchema>;
