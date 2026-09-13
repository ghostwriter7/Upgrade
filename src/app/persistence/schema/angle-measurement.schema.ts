import * as z from 'zod';
import { IdSchema } from './id.schema';
import { BodyPart } from '@domain/enum/body-part.enum';
import { json } from '@persistence/schema/json.schema';

export const AngleMeasurementSchema = z.object({
  id: IdSchema,
  mediaId: IdSchema,
  exerciseLogId: IdSchema,
  angle: z.number(),
  landmarks: json(
    z.array(
      z.object({
        point: z.object({
          x: z.number(),
          y: z.number(),
        }),
        bodyPart: z.enum(BodyPart).optional(),
      }),
    ),
  ),
});

export type AngleMeasurementDto = z.infer<typeof AngleMeasurementSchema>;
