import { Target } from '@domain/model/target';

export type TargetResult = Omit<
  Target,
  'id' | 'createdAt' | 'startedAt' | 'nextReviewDate' | 'achievedAt'
>;
