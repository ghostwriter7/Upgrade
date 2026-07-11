import { Query } from '@common/routers/query/query.model';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';

export class FindExerciseLogsByExerciseIdQuery extends Query<ExerciseLog[]> {
    constructor(public readonly exerciseId: string) {
      super();
    }
}
