import * as z from 'zod';
import { IdSchema } from './id.schema';

export const SessionSchema = z.object({
  uuid: IdSchema,
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
  rpe: z.float64().max(10).min(0.5).nullable(),
  exerciseIds: z.preprocess(
    (value) => (typeof value === 'string' ? JSON.parse(value) : value),
    z.array(z.string()).default([]),
  ),
});

export type SessionDto = z.infer<typeof SessionSchema>;
