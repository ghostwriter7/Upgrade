import * as z from 'zod';
import { IdSchema } from './id.schema';
import { BodyPart } from '@domain/enum/body-part.enum';

export const AngleMeasurementSchema = z.object({
  id: IdSchema,
  mediaId: IdSchema,
  exerciseId: z.string(),
  exerciseLogId: IdSchema,
  angle: z.number(),
  landmarks: z.array(
    z.object({
      point: z.object({
        x: z.number(),
        y: z.number(),
      }),
      bodyPart: z.enum(BodyPart).optional(),
    }),
  ),
  createdAt: z.iso.datetime(),
});

export type AngleMeasurementDto = z.infer<typeof AngleMeasurementSchema>;
