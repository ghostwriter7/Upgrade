import { inject } from '@angular/core';
import { DATABASE_TOKEN } from './database.token';
import { firstValueFrom } from 'rxjs';
import { StoreName } from './store-name.enum';
import { IndexName } from './index-name.enum';

export abstract class GenericRepository<T> {
  private readonly db = inject(DATABASE_TOKEN);

  protected async getDb(): Promise<IDBDatabase> {
    return firstValueFrom(this.db);
  }

  protected async openKeyCursor(storeName: StoreName,
                                index: IndexName,
                                createRange: () => IDBKeyRange): Promise<IDBRequest<IDBCursor | null>> {
    const transaction = await this.createReadTransaction(storeName);
    const store = transaction.objectStore(storeName);
    return store.index(index).openKeyCursor(createRange());
  }

  protected async findById(storeName: StoreName, id: string): Promise<T | undefined> {
    const transaction = await this.createReadTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    return this.responseFromRequest<T>(request);
  }

  protected async findAllBy<T>(
    storeName: StoreName,
    query: (store: IDBObjectStore) => IDBRequest,
  ): Promise<T[]> {
    const transaction = await this.createReadTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = query(store);

    return this.responseFromRequest<T[]>(request);
  }

  protected async findAll(storeName: StoreName): Promise<unknown[]> {
    const transaction = await this.createReadTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    return this.responseFromRequest<T[]>(request);
  }

  protected async put(storeName: StoreName, entity: unknown): Promise<IDBValidKey> {
    const transaction = await this.createWriteTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = store.put(entity);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error!);
    });
  }

  protected async delete(storeName: StoreName, entityId: string | number): Promise<boolean> {
    const transaction = await this.createWriteTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = store.delete(entityId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error!);
    });
  }

  protected async createReadTransaction(storeName: StoreName): Promise<IDBTransaction> {
    const db = await this.getDb();
    return db.transaction(storeName, 'readonly');
  }

  protected async createWriteTransaction(storeName: StoreName | Iterable<StoreName>): Promise<IDBTransaction> {
    const db = await this.getDb();
    return db.transaction(storeName, 'readwrite');
  }

  private responseFromRequest<T>(request: IDBRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error!);
    });
  }
}
