import * as z from 'zod';

export const ExerciseMediaSchema = z.object({
  uuid: z.uuidv4(),
  exerciseId: z.uuidv4(),
  sessionId: z.uuidv4(),
  mimeType: z.enum(['image/jpeg']),
  blob: z.instanceof(Blob),
  createdAt: z.iso.datetime(),
  width: z.number(),
  height: z.number()
});

export type ExerciseMediaDto = z.infer<typeof ExerciseMediaSchema>;
