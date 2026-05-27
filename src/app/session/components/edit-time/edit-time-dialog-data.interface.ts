import type { Temporal as TemporalType } from '@js-temporal/polyfill';

export interface EditTimeDialogData {
  label: string;
  instant: TemporalType.Instant;
}
