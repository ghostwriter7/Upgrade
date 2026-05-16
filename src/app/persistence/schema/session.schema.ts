import * as z from 'zod';
import { Depth } from '../../domain/enum/depth.enum';
import { BreathQuality } from '../../domain/enum/breath-quality.enum';
import { ExposureZone } from '../../domain/enum/exposure-zone.enum';

const toValueOrNull = <T>(value: T): T | null => value ?? null;

const BaseFlexibilitySetSchema = z.object({
  depth: z.preprocess(toValueOrNull, z.enum(Depth).nullable()),
  exposureZone: z.preprocess(toValueOrNull, z.enum(ExposureZone).nullable()),
  breathQuality: z.preprocess(toValueOrNull, z.enum(BreathQuality).nullable()),
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

export const ExerciseEntrySchema = z.object({
  exerciseId: z.uuid(),
  notes: z.string().nullable(),
  sets: z.array(ExerciseSetSchema)
});

export const SessionSchema = z.object({
  uuid: z.uuid(),
  createdAt: z.iso.datetime(),
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
  notes: z.string().nullable(),
  exerciseEntries: z.array(ExerciseEntrySchema)
});

export type SessionDto = z.infer<typeof SessionSchema>;
export type ExerciseEntryDto = z.infer<typeof ExerciseEntrySchema>;
export type ExerciseSetDto = z.infer<typeof ExerciseSetSchema>;
