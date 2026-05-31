import { InjectionToken } from '@angular/core';
import { QueryHandler } from '@common/interfaces/query-handler.interface';
import { Query } from '@domain/model/query.model';

export const QUERY_HANDLERS = new InjectionToken<QueryHandler[]>('QUERY_HANDLER');
