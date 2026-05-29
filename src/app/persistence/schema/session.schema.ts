import * as z from 'zod';

export const SessionSchema = z.object({
  uuid: z.uuid(),
  createdAt: z.iso.datetime(),
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
  notes: z.string().nullable(),
});

export type SessionDto = z.infer<typeof SessionSchema>;
