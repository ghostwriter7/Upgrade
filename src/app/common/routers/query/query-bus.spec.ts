import { Query } from '@common/routers/query/query.model';
import { QueryHandler, QueryResult } from '@common/routers/query/query-handler.interface';
import { Constructor } from '@common/types/constructor.type';
import { QueryBus } from '@common/routers/query/query-bus';
import { TestBed } from '@angular/core/testing';
import { QUERY_HANDLERS } from '@common/routers/query/query-handlers.token';

class QueryA extends Query<string[]> {}
class QueryB extends Query<number> {}
class UnknownQuery extends Query<never> {}

class QueryAHandler implements QueryHandler<QueryA> {
  public appliesTo(): Constructor<QueryA> {
    return QueryA;
  }

  query(payload: QueryA): Promise<QueryResult<QueryA>> {
    return Promise.resolve(['a', 'b', 'c']);
  }
}

class QueryBHandler implements QueryHandler<QueryB> {
  public appliesTo(): Constructor<QueryB> {
    return QueryB;
  }

  query(payload: QueryB): Promise<QueryResult<QueryB>> {
    return Promise.resolve(42);
  }
}

describe('QueryBus', () => {
  const handlerA = new QueryAHandler();
  const handlerB = new QueryBHandler();
  let queryBus: QueryBus;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: QUERY_HANDLERS, multi: true, useValue: handlerA },
        { provide: QUERY_HANDLERS, multi: true, useValue: handlerB },
        QueryBus,
      ],
    });

    queryBus = TestBed.inject(QueryBus);
  });

  test.each([
    { query: new QueryA(), expected: ['a', 'b', 'c'] },
    { query: new QueryB(), expected: 42 },
  ])('should execute a query with query type %s', ({ query, expected }) => {
    const result = queryBus.execute(query);

    expect(result).resolves.toEqual(expected);
  });

  it('should throw an exception when there is no query handler for a query', () => {
    const query = new UnknownQuery();

    expect(() => queryBus.execute(query)).toThrow(
      'No query handler found for query: UnknownQuery',
    );
  });
});
