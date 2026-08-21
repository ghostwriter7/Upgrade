import { Skills } from '@domain/enum/skill-tag.enum';

export interface Target {
  id: string;

  name: string;
  description?: string;

  skillId: Skills;

  priority: 'primary' | 'secondary';

  status: 'active' | 'reviewing' | 'paused' | 'achieved' | 'archived';

  createdAt: Temporal.Instant;
  startedAt?: Temporal.Instant;

  targetDate?: Temporal.PlainDate;
  nextReviewDate?: Temporal.PlainDate;
  achievedAt?: Temporal.PlainDate;

  motivation: Motivation[];
  reviews?: Review[];
  tradeOffs: TradeOff[];

  weeklyCommitmentInMinutes: number;
}

interface Review {
  reviewedAt: Temporal.PlainDate;
  statement: string;
  attachments?: Attachment[];
  outcome: 'continue' | 'modify' | 'pause' | 'archive';
}

interface Attachment {
  type: 'video' | 'image';
  attachmentId: string;
}

interface Motivation {
  statement: string;
}

interface TradeOff {
  statement: string;
}
