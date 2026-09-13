import { inject } from '@angular/core';
import { Database } from '@infrastructure/database';
import { BindingSpec } from '@sqlite.org/sqlite-wasm';

export abstract class GenericRepository {
  protected readonly database = inject(Database);

  protected async queryMany(query: string, params?: BindingSpec): Promise<unknown[]> {
    return this.database.queryMany(query, params);
  }

  protected async queryOne(query: string, params?: BindingSpec): Promise<unknown> {
    return this.database.queryOne(query, params);
  }

  protected async execute(query: string, params?: BindingSpec): Promise<void> {
    return this.database.execute(query, params);
  }
}
