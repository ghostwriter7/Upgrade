import * as z from 'zod';
import { IdSchema } from './id.schema';

const BaseSetSchema = z.object({
  id: IdSchema.optional(),
  exerciseLogId: IdSchema,
  index: z.number(),
});

const json = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (typeof value === 'string' ? JSON.parse(value) : value), schema);

const IsoSetSchema = BaseSetSchema.extend({
  data: json(
    z.object({
      weight: z.number(),
      duration: z.number(),
    }),
  ),
  type: z.literal('iso'),
});

const WeightSetSchema = BaseSetSchema.extend({
  type: z.literal('weight'),
  data: json(
    z.object({
      weight: z.number(),
      reps: z.number(),
    }),
  ),
});

const BodyweightSetSchema = BaseSetSchema.extend({
  type: z.literal('bodyweight'),
  data: json(
    z.object({
      reps: z.number(),
    }),
  ),
});

const DurationSetSchema = BaseSetSchema.extend({
  data: json(
    z.object({
      duration: z.number(),
    }),
  ),
  type: z.literal('duration'),
});

export const ExerciseSetSchema = z.discriminatedUnion('type', [
  IsoSetSchema,
  BodyweightSetSchema,
  WeightSetSchema,
  DurationSetSchema,
]);

export type ExerciseSetDto = z.infer<typeof ExerciseSetSchema>;
