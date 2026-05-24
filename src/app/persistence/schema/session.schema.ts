import * as z from 'zod';

export const ExerciseEntrySchema = z.object({
  exerciseId: z.uuid(),
  notes: z.string().nullable(),
  mediaIds: z.array(z.uuid()).optional().default([])
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
