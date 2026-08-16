import { inject, Injectable } from '@angular/core';
import { QueryHandler } from '@common/routers/query/query-handler.interface';
import { FindLastXSessionsQuery } from '@session/queries/find-last-x-sessions/find-last-x-sessions.query';
import { Constructor } from '@common/types/constructor.type';
import { Session } from '@domain/model/session/session.model';
import { SessionRepository } from '@persistence/repository/session.repository';

@Injectable()
export class FindLastXSessionsQueryHandler implements QueryHandler<FindLastXSessionsQuery> {
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<FindLastXSessionsQuery> {
    return FindLastXSessionsQuery;
  }

  public async query({ count }: FindLastXSessionsQuery): Promise<Session[]> {
    return this.sessionRepository.getLastSessions(count);
  }
}
