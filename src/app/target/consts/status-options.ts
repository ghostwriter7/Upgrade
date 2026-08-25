import { TargetStatus } from '@domain/model/target';

export const StatusLabels: Record<TargetStatus, string> = {
  active: 'Active',
  reviewing: 'Reviewing',
  paused: 'Paused',
  achieved: 'Achieved',
  archived: 'Archived',
};

export const StatusOptions: { value: TargetStatus; label: string }[] = (
  ['active', 'reviewing', 'paused', 'achieved', 'archived'] as const
).map((value) => ({ value, label: StatusLabels[value] }));
