export interface Request {
  id: string;
  type: 'query' | 'execute' | 'export-db';
  sql: string;
  params: unknown[];
}

interface SqlRequest {
  sql: string;
  params: unknown[];
}

export interface QueryRequest extends SqlRequest {
  type: 'query';
}

export interface ExecuteRequest extends SqlRequest {
  type: 'execute';
}

export interface ExportDbRequest extends Request {
  type: 'export-db';
}

export type RequestType = QueryRequest | ExecuteRequest | ExportDbRequest;
