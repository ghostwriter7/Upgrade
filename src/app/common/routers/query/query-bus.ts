import { inject, Injectable } from '@angular/core';
import { QUERY_HANDLERS } from '@common/tokens/query-handlers.token';
import { QueryHandler, QueryResult } from '@common/interfaces/query-handler.interface';
import { Constructor } from '@common/types/constructor.type';
import { Query } from '@domain/model/query.model';

type MayBeQueryHandler<T extends Query> = QueryHandler<T> | undefined;

@Injectable({ providedIn: 'root' })
export class QueryBus {
  private readonly handlers: QueryHandler[] = inject(QUERY_HANDLERS);
  private readonly lookup = this.handlers.reduce((lookup, handler) => {
    lookup.set(handler.appliesTo(), handler);
    return lookup;
  }, new Map<Constructor<Query>, QueryHandler>());

  public execute<T extends Query>(query: T): Promise<QueryResult<T>> {
    const handler = this.lookup.get(query.constructor as Constructor<T>) as MayBeQueryHandler<T>;

    if (!handler) {
      throw new Error(`No query handler found for query: ${query.constructor.name}`);
    }

    return handler.query(query);
  }
}
