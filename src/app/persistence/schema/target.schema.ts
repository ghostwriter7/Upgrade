import { z } from 'zod';

const TemporalInstantFromIsoDateTime = z.codec(z.iso.datetime(), z.instanceof(Temporal.Instant), {
  decode: (value) => Temporal.Instant.from(value),
  encode: (value) => value.toString(),
});

const StatementSchema = z.object({
  statement: z.string().nonempty(),
});

const ReviewSchema = z.object({
  reviewedAt: TemporalInstantFromIsoDateTime,
  statement: z.string().nonempty(),
  outcome: z.enum(['continue', 'modify', 'pause', 'archive']),
});

export const TargetSchema = z.object({
  id: z.nanoid(),
  name: z.string(),
  description: z.string().optional(),
  skillId: z.string(),
  priority: z.enum(['primary', 'secondary', 'unprioritized']),
  status: z.enum(['active', 'reviewing', 'paused', 'achieved', 'archived']),
  createdAt: TemporalInstantFromIsoDateTime,
  startedAt: TemporalInstantFromIsoDateTime.optional(),
  targetDate: TemporalInstantFromIsoDateTime.optional(),
  nextReviewDate: TemporalInstantFromIsoDateTime.optional(),
  achievedAt: TemporalInstantFromIsoDateTime.optional(),
  motivation: z.array(StatementSchema),
  reviews: z.array(ReviewSchema).optional(),
  tradeOffs: z.array(StatementSchema),
  weeklyCommitmentInMinutes: z.number(),
});

export type TargetDto = z.infer<typeof TargetSchema>;
