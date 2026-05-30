import * as z from 'zod';
import { IdSchema } from './id.schema';

export const SessionSchema = z.object({
  uuid: IdSchema,
  createdAt: z.iso.datetime(),
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
  notes: z.string().nullable(),
});

export type SessionDto = z.infer<typeof SessionSchema>;
