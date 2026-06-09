import { Provider } from '@angular/core';
import { QUERY_HANDLERS } from '@common/routers/query/query-handlers.token';
import {
  FindSessionsByDateQueryHandler
} from '@session/queries/find-sessions-by-date/find-sessions-by-date-query.handler';
import {
  FindMediaAndMeasurementsByExerciseLogIdQueryHandler
} from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id-query.handler';
import {
  FindLastSetForExerciseIdQueryHandler
} from '@session/queries/find-last-set-for-exercise-id/find-last-set-for-exercise-id-query.handler';

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
        useClass: FindLastSetForExerciseIdQueryHandler,
      }
    ];
  }
}
