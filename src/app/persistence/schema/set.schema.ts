import * as z from 'zod';
import { IdSchema } from './id.schema';

const BaseFlexibilitySetSchema = z.object({
  id: z.nanoid().optional(),
  sessionId: IdSchema,
  exerciseId: IdSchema,
  index: z.number(),
});

const IsoSetSchema = BaseFlexibilitySetSchema.extend({
  duration: z.number(),
  weight: z.number().optional(),
  type: z.literal('iso'),
});

const BodyweightSetSchema = BaseFlexibilitySetSchema.extend({
  reps: z.number(),
  type: z.literal('bodyweight'),
});

const WeightSetSchema = BaseFlexibilitySetSchema.extend({
  weight: z.number(),
  reps: z.number(),
  type: z.literal('weight'),
});

export const ExerciseSetSchema = z.discriminatedUnion('type', [
  IsoSetSchema,
  BodyweightSetSchema,
  WeightSetSchema,
]);

export type ExerciseSetDto = z.infer<typeof ExerciseSetSchema>;
