import { z } from 'zod';
import { json } from '@persistence/schema/json.schema';
import { ExerciseSetTypes } from '@domain/model/exercise-set/exercise-set.model';
import { EXERCISE_TYPES } from '@domain/enum/exercise-types.enum';

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastPerformedAt: z.iso.datetime().nullable(),
  unitsOfMeasurement: json(z.array(z.enum(ExerciseSetTypes)).nullable()),
  isFavourite: z.preprocess((val) => val === 1, z.boolean()),
  status: z.enum(['active', 'archived']),
  type: z.enum(EXERCISE_TYPES),
});

export type ExerciseDto = z.infer<typeof ExerciseSchema>;
