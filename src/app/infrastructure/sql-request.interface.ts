import type { BindableValue } from '@sqlite.org/sqlite-wasm';

export interface Request {
  id: string;
  type: 'query' | 'query-one' | 'execute' | 'export-db';
}

interface SqlRequest extends Request {
  sql: string;
  params: BindableValue[];
}

export interface QueryRequest extends SqlRequest {
  type: 'query' | 'query-one';
}

export interface ExecuteRequest extends SqlRequest {
  type: 'execute';
}

export interface ExportDbRequest extends Request {
  type: 'export-db';
}

export type RequestType = QueryRequest | ExecuteRequest | ExportDbRequest;
