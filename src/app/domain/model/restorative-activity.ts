export interface RestorativeActivity {
  id: string;
  name: string;
  category: 'play' | 'recovery';
  startedAt: Temporal.Instant;
  finishedAt?: Temporal.Instant;
  description?: string;
  feelingAfter?: 'worse' | 'neutral' | 'better' | 'restored';
}
