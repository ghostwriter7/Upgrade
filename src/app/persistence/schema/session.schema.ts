import * as z from 'zod';
import { IdSchema } from './id.schema';

export const SessionSchema = z.object({
  uuid: IdSchema,
  createdAt: z.iso.datetime(),
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
  rpe: z.float64().max(10).min(0.5).optional(),
  exerciseIds: z.array(z.string()).default([]),
});

export type SessionDto = z.infer<typeof SessionSchema>;
