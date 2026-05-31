import { inject, Injectable } from '@angular/core';
import { QueryHandler, QueryResult } from '@common/routers/query/query-handler.interface';
import { Constructor } from '@common/types/constructor.type';
import { FindSessionsByDateQuery } from '@session/queries/find-sessions-by-date/find-sessions-by-date.query';
import { SessionRepository } from '@persistence/repository/session.repository';

@Injectable()
export class FindSessionsByDateQueryHandler implements QueryHandler<FindSessionsByDateQuery> {
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<FindSessionsByDateQuery> {
    return FindSessionsByDateQuery;
  }

  public query(payload: FindSessionsByDateQuery): Promise<QueryResult<FindSessionsByDateQuery>> {
    return this.sessionRepository.findAllByDate(payload.date);
  }
}
