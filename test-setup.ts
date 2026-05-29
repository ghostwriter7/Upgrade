import { Temporal } from '@js-temporal/polyfill';
import { vi } from 'vitest';

Object.defineProperties(globalThis, {
  Temporal: {
    value: Temporal,
    configurable: true,
    writable: true,
  },
  showSaveFilePicker: {
    value: vi.fn(),
    configurable: true,
    writable: true,
  },
  showOpenFilePicker: {
    value: vi.fn(),
    configurable: true,
    writable: true,
  },
});
