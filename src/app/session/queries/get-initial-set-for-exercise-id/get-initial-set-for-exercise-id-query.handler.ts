import { inject, Injectable } from '@angular/core';
import { QueryHandler, QueryResult } from '@common/routers/query/query-handler.interface';
import { GetInitialSetForExerciseIdQuery } from '@session/queries/get-initial-set-for-exercise-id/get-initial-set-for-exercise-id.query';
import { Constructor } from '@common/types/constructor.type';
import { SetRepository } from '@persistence/repository/set.repository';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { SetDataMapper } from '@session/components/set-form/mapper/set-data.mapper';

@Injectable()
export class GetInitialSetForExerciseIdQueryHandler implements QueryHandler<GetInitialSetForExerciseIdQuery> {
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): Constructor<GetInitialSetForExerciseIdQuery> {
    return GetInitialSetForExerciseIdQuery;
  }

  public async query(
    payload: GetInitialSetForExerciseIdQuery,
  ): Promise<QueryResult<GetInitialSetForExerciseIdQuery>> {
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

      if (set)
        return SetDataMapper.toDto(set);
    }

    return { type: 'bodyweight', reps: 1, weight: 0, duration: 0 };
  }
}
