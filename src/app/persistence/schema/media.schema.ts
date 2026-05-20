import * as z from 'zod';

export const VideoMediaSchema = z.object({
  uuid: z.uuidv4(),
  exerciseId: z.uuidv4(),
  sessionId: z.uuidv4(),
  type: z.enum(['photo', 'video']),
  mimeType: z.enum(['video/webm']),
  blob: z.instanceof(Blob),
  createdAt: z.iso.datetime(),
  duration: z.number().positive(),
});

export type VideoMediaDto = z.infer<typeof VideoMediaSchema>;
