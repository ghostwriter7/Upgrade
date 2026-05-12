import * as z from 'zod';

const IsoSetSchema = z.object({
  duration: z.number(),
  weight: z.number().optional(),
  type: z.literal('iso'),
});

const BodyweightSetSchema = z.object({
  reps: z.number(),
  type: z.literal('bodyweight'),
});

const WeightSetSchema = z.object({
  weight: z.number(),
  reps: z.number(),
  type: z.literal('weight'),
})

export const ExerciseSetSchema = z.discriminatedUnion('type', [
  IsoSetSchema,
  BodyweightSetSchema,
  WeightSetSchema,
]);

export const ExerciseEntrySchema = z.object({
  exerciseId: z.uuid(),
  notes: z.string().nullable(),
  sets: z.array(ExerciseSetSchema)
})

export const SessionSchema = z.object({
  uuid: z.uuid(),
  createdAt: z.iso.datetime(),
  startedAt: z.iso.datetime().nullable(),
  finishedAt: z.iso.datetime().nullable(),
  notes: z.string().nullable(),
  exerciseEntries: z.array(ExerciseEntrySchema)
});

export type SessionDto = z.infer<typeof SessionSchema>;
export type ExerciseEntryDto = z.infer<typeof ExerciseEntrySchema>;
export type ExerciseSetDto = z.infer<typeof ExerciseSetSchema>;
