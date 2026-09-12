import { Provider } from '@angular/core';
import { QUERY_HANDLERS } from '@common/routers/query/query-handlers.token';
import { FindSessionsByDateQueryHandler } from '@session/queries/find-sessions-by-date/find-sessions-by-date-query.handler';
import { FindMediaAndMeasurementsByExerciseLogIdQueryHandler } from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id-query.handler';
import { GetInitialSetForExerciseIdQueryHandler } from '@session/queries/get-initial-set-for-exercise-id/get-initial-set-for-exercise-id-query.handler';
import { FindExerciseLogsByExerciseIdQueryHandler } from '@session/queries/find-exercise-logs-by-exercise-id/find-exercise-logs-by-exercise-id-query.handler';

export class QueryHandlerProvider {
  public static forRoot(): Provider[] {
    return [
      FindSessionsByDateQueryHandler,
      FindMediaAndMeasurementsByExerciseLogIdQueryHandler,
      GetInitialSetForExerciseIdQueryHandler,
      FindExerciseLogsByExerciseIdQueryHandler,
    ].map((handler) => ({
      provide: QUERY_HANDLERS,
      multi: true,
      useClass: handler,
    }));
  }
}
