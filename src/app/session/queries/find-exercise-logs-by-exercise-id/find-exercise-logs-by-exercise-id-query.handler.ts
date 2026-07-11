import { QueryHandler, QueryResult } from '@common/routers/query/query-handler.interface';
import { FindExerciseLogsByExerciseIdQuery } from '@session/queries/find-exercise-logs-by-exercise-id/find-exercise-logs-by-exercise-id.query';
import { Constructor } from '@angular/cdk/schematics';
import { inject, Service } from '@angular/core';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { SetRepository } from '@persistence/repository/set.repository';

@Service({ autoProvided: false })
export class FindExerciseLogsByExerciseIdQueryHandler implements QueryHandler<FindExerciseLogsByExerciseIdQuery> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): Constructor<FindExerciseLogsByExerciseIdQuery> {
    return FindExerciseLogsByExerciseIdQuery;
  }

  public async query({
    exerciseId,
  }: FindExerciseLogsByExerciseIdQuery): Promise<QueryResult<FindExerciseLogsByExerciseIdQuery>> {
    const [logs, sets] = await Promise.all([
      this.exerciseLogRepository.getAllLogsByExerciseId(exerciseId),
      this.setRepository.getAllBeExerciseId(exerciseId),
    ]);

    const setsBySessionId = Object.groupBy(sets, (set) => set.sessionId);

    return logs
      .map((log) => {
        const logSets = setsBySessionId[log.sessionId] ?? [];
        logSets.sort((a, b) => a.index - b.index);
        return log.withSets(logSets);
      })
      .toSorted((a, b) => Temporal.Instant.compare(b.createdAt, a.createdAt));
  }
}
