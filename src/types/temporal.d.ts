import type { Temporal as TemporalType } from '@js-temporal/polyfill';

declare global {
  const Temporal: typeof TemporalType;
}
