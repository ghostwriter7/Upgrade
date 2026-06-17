import * as z from 'zod';
import { IdSchema } from './id.schema';

const BaseSetSchema = z.object({
  id: IdSchema.optional(),
  sessionId: IdSchema,
  exerciseId: z.string(),
  index: z.number(),
});

const IsoSetSchema = BaseSetSchema.extend({
  duration: z.number(),
  weight: z.number().optional(),
  type: z.literal('iso'),
});

const BodyweightSetSchema = BaseSetSchema.extend({
  reps: z.number(),
  type: z.literal('bodyweight'),
});

const WeightSetSchema = BaseSetSchema.extend({
  weight: z.number(),
  reps: z.number(),
  type: z.literal('weight'),
});

const DurationSetSchema = BaseSetSchema.extend({
  duration: z.number(),
  type: z.literal('duration')
});

export const ExerciseSetSchema = z.discriminatedUnion('type', [
  IsoSetSchema,
  BodyweightSetSchema,
  WeightSetSchema,
  DurationSetSchema
]);

export type ExerciseSetDto = z.infer<typeof ExerciseSetSchema>;
