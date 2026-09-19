import type { BindingSpec } from '@sqlite.org/sqlite-wasm';

export interface Request {
  id: string;
  type:
    | 'query'
    | 'query-one'
    | 'execute'
    | 'execute-batch'
    | 'execute-many'
    | 'export-db'
    | 'import-db';
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

export interface ExecuteBatchRequest extends Request {
  type: 'execute-batch';
  sql: string;
  params: BindingSpec[];
}

export interface ExecuteManyRequest extends Request {
  type: 'execute-many';
  requests: ExecuteManyRequestsPayload;
}

export interface ExportDbRequest extends Request {
  type: 'export-db';
}

export interface ImportDbRequest extends Request {
  type: 'import-db';
  bytes: ArrayBuffer;
}

export type RequestType =
  | QueryRequest
  | ExecuteRequest
  | ExecuteBatchRequest
  | ExportDbRequest
  | ExecuteManyRequest
  | ImportDbRequest;

export type ExecuteRequestPayload = { sql: string; params?: BindingSpec };
export type ExecuteBatchRequestPayload = { sql: string; batch: boolean; params: BindingSpec[] };
export type ExecuteManyRequestsPayload = (ExecuteRequestPayload | ExecuteBatchRequestPayload)[];
