import { CapabilityDefinition } from '@domain/model/capability-definition';

export const capabilities = [
  { id: 'shoulder-flexion', name: 'Shoulder flexion' },
  { id: 'shoulder-external-rotation', name: 'Shoulder external rotation' },
  { id: 'thoracic-extension', name: 'Thoracic extension' },

  { id: 'adductor-extensibility', name: 'Adductor extensibility' },
  { id: 'adductor-end-range-strength', name: 'Adductor end-range strength' },

  { id: 'hamstring-extensibility', name: 'Hamstring extensibility' },
  { id: 'hamstring-end-range-strength', name: 'Hamstring end-range strength' },

  { id: 'hip-flexor-extensibility', name: 'Hip flexor extensibility' },
  { id: 'active-hip-flexion', name: 'Active hip flexion' },
] as const satisfies CapabilityDefinition[];

export type CapabilityId = (typeof capabilities)[number]['id'];
