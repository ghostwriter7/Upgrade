export interface SqlRequest {
  id: string;
  type: 'query' | 'execute';
  sql: string;
  params: unknown[];
}
