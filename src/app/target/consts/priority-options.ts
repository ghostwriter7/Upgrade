import { TargetPriority } from '@domain/model/target';

export const PriorityLabels: Record<TargetPriority, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  unprioritized: 'Unprioritized',
};

export const PriorityOptions: { value: TargetPriority; label: string }[] = (
  ['primary', 'secondary', 'unprioritized'] as const
).map((value) => ({ value, label: PriorityLabels[value] }));
