import { SqlResponse } from './sql-response.type';
import {
  ExecuteRequest,
  ExportDbRequest,
  QueryRequest,
  RequestType,
} from './sql-request.interface';
import { createNanoId } from '@common/function/create-uuid.function';
import { Service } from '@angular/core';
import { BindingSpec } from '@sqlite.org/sqlite-wasm';

@Service()
export class DatabaseConnection {
  private readonly pending = new Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (reason: unknown) => void;
    }
  >();
  private readonly worker: Worker;

  constructor() {
    this.worker = new Worker(new URL('../sql.worker', import.meta.url));
    this.worker.onmessage = ({ data }: MessageEvent<SqlResponse>) => this.handleResponse(data);

    this.worker.onerror = (event: ErrorEvent) => this.handleWorkerError(event);
  }

  public export(): Promise<Uint8Array<ArrayBuffer>> {
    return this.sendRequest({ type: 'export-db' } as ExportDbRequest) as Promise<
      Uint8Array<ArrayBuffer>
    >;
  }

  public queryMany<T>(sql: string, params?: BindingSpec): Promise<T[]> {
    return this.sendRequest({ sql, params, type: 'query' } as QueryRequest) as Promise<T[]>;
  }

  public queryOne<T>(sql: string, params: BindingSpec): Promise<T | null> {
    return this.sendRequest({
      sql,
      params,
      type: 'query-one',
    } as QueryRequest) as Promise<T | null>;
  }

  public execute(sql: string, params?: BindingSpec): Promise<void> {
    return this.sendRequest({ sql, params, type: 'execute' } as ExecuteRequest) as Promise<void>;
  }

  private sendRequest(request: Omit<RequestType, 'id'>): Promise<unknown> {
    const id = createNanoId();

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });

      this.worker.postMessage({ id, ...request });
    });
  }

  private handleResponse(data: SqlResponse): void {
    const pending = this.pending.get(data.id);

    if (!pending) {
      console.warn(`Unknown SQL response: ${data.id}`);
      return;
    }

    this.pending.delete(data.id);

    if (data.type === 'success') {
      pending.resolve(data.result);
    } else {
      pending.reject(new Error(data.error.message));
    }
  }

  private handleWorkerError(event: ErrorEvent): void {
    for (const { reject } of this.pending.values()) {
      reject(event.error ?? new Error(event.message));
    }
    this.pending.clear();
  }
}
