import { Provider } from '@angular/core';
import { QUERY_HANDLERS } from '@common/routers/query/query-handlers.token';
import {
  FindSessionsByDateQueryHandler
} from '@session/queries/find-sessions-by-date/find-sessions-by-date-query.handler';

export class QueryHandlerProvider {
  public static forRoot(): Provider[] {
    return [
      {
        provide: QUERY_HANDLERS,
        multi: true,
        useClass: FindSessionsByDateQueryHandler
      }
    ];
  }
}
