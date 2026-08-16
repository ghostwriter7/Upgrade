import { z } from 'zod';
import { RateOfPerceivedEffortValue } from '@domain/enum/rate-of-perceived-effort-value';

export const TemplateSchema = z.object({
  id: z.nanoid(),
  name: z.string(),
  rpe: z.enum(RateOfPerceivedEffortValue).default(RateOfPerceivedEffortValue.Mid),
  description: z.string().default(''),
  exerciseIds: z.array(z.string()).nonempty(),
  isFavourite: z.boolean().default(false),
});

export type TemplateDto = z.infer<typeof TemplateSchema>;
