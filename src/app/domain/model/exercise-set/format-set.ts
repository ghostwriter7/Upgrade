import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';

export function formatSet({ type, data }: ExerciseSet): string {
  switch (type) {
    case 'bodyweight':
      return `${data.reps}`;
    case 'weight':
      return `${data.reps} + ${data.weight} kg`;
    case 'iso': {
      if (data.weight) {
        return `${data.duration}s + ${data.weight} kg`;
      }
      return `${data.duration}s`;
    }
    case 'duration': {
      const { hours, minutes } = Temporal.Duration.from({ minutes: data.duration });
      if (hours) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }
  }
}
