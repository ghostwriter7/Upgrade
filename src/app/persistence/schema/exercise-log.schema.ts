import * as z from 'zod';
import { IdSchema } from './id.schema';

export const ExerciseLogSchema = z.object({
  id: IdSchema,
  sessionId: IdSchema,
  exerciseId: z.string(),
  notes: z.string().nullable(),
  mediaIds: z.array(IdSchema).optional().default([]),
});

export type ExerciseLogDto = z.infer<typeof ExerciseLogSchema>;
