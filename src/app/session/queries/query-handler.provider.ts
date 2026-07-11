import { Provider } from '@angular/core';
import { QUERY_HANDLERS } from '@common/routers/query/query-handlers.token';
import { FindSessionsByDateQueryHandler } from '@session/queries/find-sessions-by-date/find-sessions-by-date-query.handler';
import { FindMediaAndMeasurementsByExerciseLogIdQueryHandler } from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id-query.handler';
import { GetInitialSetForExerciseIdQueryHandler } from '@session/queries/get-initial-set-for-exercise-id/get-initial-set-for-exercise-id-query.handler';
import { GetSkillCoverageQueryHandler } from '@session/queries/get-skill-coverage/get-skill-coverage-query.handler';
import { FindExerciseLogsByExerciseIdQueryHandler } from '@session/queries/find-exercise-logs-by-exercise-id/find-exercise-logs-by-exercise-id-query.handler';

export class QueryHandlerProvider {
  public static forRoot(): Provider[] {
    return [
      {
        provide: QUERY_HANDLERS,
        multi: true,
        useClass: FindSessionsByDateQueryHandler,
      },
      {
        provide: QUERY_HANDLERS,
        multi: true,
        useClass: FindMediaAndMeasurementsByExerciseLogIdQueryHandler,
      },
      {
        provide: QUERY_HANDLERS,
        multi: true,
        useClass: GetInitialSetForExerciseIdQueryHandler,
      },
      {
        provide: QUERY_HANDLERS,
        multi: true,
        useClass: GetSkillCoverageQueryHandler,
      },
      {
        provide: QUERY_HANDLERS,
        multi: true,
        useClass: FindExerciseLogsByExerciseIdQueryHandler,
      },
    ];
  }
}
