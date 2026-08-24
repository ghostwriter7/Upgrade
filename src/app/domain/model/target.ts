export interface Target {
  id: string;

  name: string;
  description?: string;

  skillId: string;

  priority?: 'primary' | 'secondary';

  status: 'active' | 'reviewing' | 'paused' | 'achieved' | 'archived';

  createdAt: Temporal.Instant;
  startedAt?: Temporal.Instant;

  targetDate?: Temporal.Instant;
  nextReviewDate?: Temporal.Instant;
  achievedAt?: Temporal.Instant;

  motivation: Motivation[];
  reviews?: Review[];
  tradeOffs: TradeOff[];

  weeklyCommitmentInMinutes: number;
}

export type TargetPriority = Target['priority'];
export type TargetStatus = Target['status'];

interface Review {
  reviewedAt: Temporal.Instant;
  statement: string;
  attachments?: Attachment[];
  outcome: 'continue' | 'modify' | 'pause' | 'archive';
}

interface Attachment {
  type: 'video' | 'image';
  attachmentId: string;
}

export interface Motivation {
  statement: string;
}

interface TradeOff {
  statement: string;
}
