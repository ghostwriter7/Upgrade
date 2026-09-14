import type { BindingSpec } from '@sqlite.org/sqlite-wasm';

export interface Request {
  id: string;
  type: 'query' | 'query-one' | 'execute' | 'export-db' | 'import-db';
}

interface SqlRequest extends Request {
  sql: string;
  params: BindingSpec;
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

export interface ImportDbRequest extends Request {
  type: 'import-db';
  bytes: ArrayBuffer;
}

export type RequestType = QueryRequest | ExecuteRequest | ExportDbRequest | ImportDbRequest;
