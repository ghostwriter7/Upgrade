import * as z from 'zod';
import { IdSchema } from './id.schema';

export const ExerciseMediaSchema = z.object({
  id: IdSchema,
  exerciseId: z.string(),
  exerciseLogId: IdSchema,
  mimeType: z.enum(['image/jpeg']),
  blob: z.instanceof(Blob),
  createdAt: z.iso.datetime(),
  width: z.number(),
  height: z.number()
});

export type ExerciseMediaDto = z.infer<typeof ExerciseMediaSchema>;
