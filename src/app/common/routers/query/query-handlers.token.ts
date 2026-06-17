import { InjectionToken } from '@angular/core';
import { QueryHandler } from '@common/routers/query/query-handler.interface';

export const QUERY_HANDLERS = new InjectionToken<QueryHandler[]>('QUERY_HANDLER');
