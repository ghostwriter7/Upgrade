import * as z from 'zod';
import { IdSchema } from './id.schema';

export const ExerciseLogSchema = z.object({
  id: IdSchema,
  sessionId: IdSchema,
  exerciseId: z.string(),
  notes: z.string().nullable(),
  index: z.number().optional().default(0),
  createdAt: z.iso.datetime()
});

export type ExerciseLogDto = z.infer<typeof ExerciseLogSchema>;
