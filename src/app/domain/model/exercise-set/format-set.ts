import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';

export function formatSet(set: ExerciseSet): string {
  switch (set.type) {
    case 'bodyweight':
      return `${set.reps}`;
    case 'weight':
      return `${set.reps} + ${set.weight} kg`;
    case 'iso': {
      if (set.weight) {
        return `${set.duration}s + ${set.weight} kg`;
      }
      return `${set.duration}s`;
    }
    case 'duration': {
      const { hours, minutes } = Temporal.Duration.from({ seconds: set.duration });
      if (hours) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }
  }
}
