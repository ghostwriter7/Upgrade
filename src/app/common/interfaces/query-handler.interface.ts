import { Constructor } from '@common/types/constructor.type';
import { Query } from '@domain/model/query.model';

export type QueryResult<TQuery extends Query> = TQuery extends Query<infer TResult> ? TResult : unknown;

export interface QueryHandler<TQuery extends Query = Query> {
  appliesTo(): Constructor<TQuery>;
  query(payload: TQuery): Promise<QueryResult<TQuery>>;
}
