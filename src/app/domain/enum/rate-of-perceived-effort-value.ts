export const RateOfPerceivedEffortValue = {
  Easy: 'easy',
  Mid: 'mid',
  Hard: 'hard',
} as const;

export type RateOfPerceivedEffort =
  (typeof RateOfPerceivedEffortValue)[keyof typeof RateOfPerceivedEffortValue];

export const RateOfPerceivedEffortOptions = [
  { label: 'Easy', value: RateOfPerceivedEffortValue.Easy },
  { label: 'Mid', value: RateOfPerceivedEffortValue.Mid },
  { label: 'Hard', value: RateOfPerceivedEffortValue.Hard },
] as const;
