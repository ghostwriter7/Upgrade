import { z } from 'zod';

export const TemplateSchema = z.object({
  id: z.nanoid(),
  name: z.string(),
  description: z.string().default(''),
  exerciseIds: z.array(z.string()).nonempty(),
  isFavourite: z.boolean().default(false),
});

export type TemplateDto = z.infer<typeof TemplateSchema>;
