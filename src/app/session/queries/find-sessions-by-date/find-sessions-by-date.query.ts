import { Query } from '@common/routers/query/query.model';
import { Session } from '@domain/model/session/session.model';

export class FindSessionsByDateQuery extends Query<Session[]> {
  constructor(public readonly date: Temporal.ZonedDateTime) {
    super();
  }
}
