import { Query } from '@common/routers/query/query.model';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';

export class FindLastSetForExerciseIdQuery extends Query<ExerciseSet | null> {
  constructor(public readonly exerciseId: string) {
    super();
  }

}
