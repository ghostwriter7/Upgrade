import { inject, Service } from '@angular/core';
import { QueryBus } from '@common/routers/query/query-bus';
import { Session } from '@domain/model/session/session.model';
import { FindLastXSessionsQuery } from '@session/queries/find-last-x-sessions/find-last-x-sessions.query';

@Service()
export class SessionFacade {
  private readonly queryBus = inject(QueryBus);

  public getLastXSessions(count: number): Promise<Session[]> {
    return this.queryBus.execute(new FindLastXSessionsQuery(count));
  }
}
