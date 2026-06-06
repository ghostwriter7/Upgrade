import * as z from 'zod';
import { IdSchema } from './id.schema';

const ExerciseMediaBaseSchema = z.object({
  id: IdSchema,
  exerciseId: z.string(),
  exerciseLogId: IdSchema,
  mimeType: z.enum(['image/jpeg']),
  createdAt: z.iso.datetime(),
  width: z.number(),
  height: z.number(),
});

export const ExerciseMediaSchema = ExerciseMediaBaseSchema.extend({
  blob: z.instanceof(Blob),
});

export const JsonSerializedMediaSchema = ExerciseMediaBaseSchema.extend({
  base64: z.string(),
});

export type ExerciseMediaBaseDto = z.infer<typeof ExerciseMediaBaseSchema>;
export type JsonSerializedMediaDto = z.infer<typeof JsonSerializedMediaSchema>;
export type ExerciseMediaDto = z.infer<typeof ExerciseMediaSchema>;
