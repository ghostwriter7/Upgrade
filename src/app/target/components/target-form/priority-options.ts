import { TargetPriority } from '@domain/model/target';

export const PriorityOptions: { value: TargetPriority; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
];
