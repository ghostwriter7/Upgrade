export type ExerciseType = 'strength' | 'isometric' | 'flexibility' | 'skill';

export const EXERCISE_TYPES: readonly ExerciseType[] = [
  'strength',
  'isometric',
  'flexibility',
  'skill',
];

export const EXERCISE_TYPE_LABELS: Readonly<Record<ExerciseType, string>> = {
  strength: 'Strength',
  isometric: 'Isometric',
  flexibility: 'Flexibility',
  skill: 'Skill',
};
