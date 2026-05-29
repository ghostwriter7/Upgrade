import * as z from 'zod';

export const ExerciseLogSchema = z.object({
  id: z.uuid(),
  sessionId: z.uuid(),
  exerciseId: z.uuid(),
  notes: z.string().nullable(),
  mediaIds: z.array(z.uuid()).optional().default([]),
});

export type ExerciseLogDto = z.infer<typeof ExerciseLogSchema>;
