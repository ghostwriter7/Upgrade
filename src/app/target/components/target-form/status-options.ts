import { TargetStatus } from '@domain/model/target';

export const StatusOptions: { value: TargetStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'paused', label: 'Paused' },
  { value: 'achieved', label: 'Achieved' },
  { value: 'archived', label: 'Archived' },
];
