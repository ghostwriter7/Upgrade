import { inject, Injectable } from '@angular/core';
import { QueryHandler, QueryResult } from '@common/routers/query/query-handler.interface';
import { FindLastSetForExerciseIdQuery } from '@session/queries/find-last-set-for-exercise-id/find-last-set-for-exercise-id.query';
import { Constructor } from '@common/types/constructor.type';
import { SetRepository } from '@persistence/repository/set.repository';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';

@Injectable()
export class FindLastSetForExerciseIdQueryHandler implements QueryHandler<FindLastSetForExerciseIdQuery> {
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): Constructor<FindLastSetForExerciseIdQuery> {
    return FindLastSetForExerciseIdQuery;
  }

  public async query(
    payload: FindLastSetForExerciseIdQuery,
  ): Promise<QueryResult<FindLastSetForExerciseIdQuery>> {
    const exerciseLogs = await this.exerciseLogRepository.findLatestExerciseLogsByExerciseId(
      payload.exerciseId,
      5,
    );

    for (const exerciseLog of exerciseLogs) {
      const sets = await this.setRepository.getAllBySessionIdAndExerciseId(
        exerciseLog.sessionId,
        exerciseLog.exerciseId,
      );
      const set = sets.at(-1);

      if (set) return set;
    }

    return null;
  }
}
