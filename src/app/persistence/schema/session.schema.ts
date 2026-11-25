import * as z from 'zod';
import { IdSchema } from './id.schema';

export const SessionSchema = z.object({
  id: IdSchema,
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
  exerciseIds: z.preprocess(
    (value) => (typeof value === 'string' ? JSON.parse(value) : value),
    z.array(z.string()).default([]),
  ),
});

export type SessionDto = z.infer<typeof SessionSchema>;
