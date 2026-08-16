import { RateOfPerceivedEffort } from '@domain/enum/rate-of-perceived-effort-value';

export interface Template {
  id: string;
  name: string;
  description: string;
  rpe: RateOfPerceivedEffort;
  exerciseIds: string[];
  isFavourite: boolean;
}
