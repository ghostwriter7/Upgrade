import { z } from 'zod';

const TemplateSchema = z.object({
  id: z.nanoid(),
  name: z.string(),
  description: z.string().optional(),
  exerciseIds: z.array(z.string()).nonempty(),
  isFavourite: z.boolean().default(false),
});

export type TemplateDto = z.infer<typeof TemplateSchema>;
