import { InjectionToken } from '@angular/core';
import { QueryHandler } from '@common/routers/query/query-handler.interface';
import { Query } from '@common/routers/query/query.model';

export const QUERY_HANDLERS = new InjectionToken<QueryHandler[]>('QUERY_HANDLER');
