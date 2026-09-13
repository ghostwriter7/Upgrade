import { z } from 'zod';
import { json } from '@persistence/schema/json.schema';

const StatementSchema = z.object({
  statement: z.string().nonempty(),
});

export const TargetSchema = z.object({
  id: z.nanoid(),
  name: z.string(),
  description: z.string().nullable(),
  skillId: z.string(),
  motivation: json(z.array(StatementSchema)),
  tradeOffs: json(z.array(StatementSchema)),
  weeklyCommitmentInMinutes: z.number(),
});

export type TargetDto = z.infer<typeof TargetSchema>;
