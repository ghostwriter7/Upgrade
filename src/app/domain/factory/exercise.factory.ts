import { createUuid } from '../../common/function/create-uuid.function';
import { Exercise, isExercise } from '../model/exercise.model';

export class ExerciseFactory {
  public static createNew(name: string, description: string | null = null): Exercise {
    return new Exercise(createUuid(), name, description, new Date().toISOString(), null);
  }

  public static fromJSON(input: object): Exercise {
    if (!isExercise(input)) throw new Error('Invalid input.');

    return new Exercise(input.uuid, input.name, input.description, input.createdAt, input.updatedAt);
  }
}
