import { Temporal } from '@js-temporal/polyfill';

Object.defineProperty(globalThis, 'Temporal', {
  value: Temporal,
  configurable: true,
  writable: true,
});
