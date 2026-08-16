import { Query } from '@common/routers/query/query.model';
import { Session } from '@domain/model/session/session.model';

export class FindLastXSessionsQuery extends Query<Session[]> {
  constructor(public readonly count: number) {
    super();
  }
}
