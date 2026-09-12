import { inject } from '@angular/core';
import { DATABASE_TOKEN } from './database.token';
import { firstValueFrom } from 'rxjs';
import { StoreName } from './store-name.enum';
import { IndexName } from './index-name.enum';
import { Database } from '@infrastructure/database';

export abstract class GenericRepository<T> {
  private readonly db = inject(DATABASE_TOKEN);
  protected readonly database = inject(Database);

  protected async getDb(): Promise<IDBDatabase> {
    return firstValueFrom(this.db);
  }

  protected async openCursor(
    storeName: StoreName,
    index: IndexName,
    createRange: () => IDBKeyRange,
  ): Promise<IDBRequest<IDBCursorWithValue | null>> {
    const transaction = await this.createReadTransaction(storeName);
    const store = transaction.objectStore(storeName);
    return store.index(index).openCursor(createRange());
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

  protected async findAll(storeName: StoreName): Promise<T[]> {
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

  protected async delete(storeName: StoreName, entityId: string | number): Promise<void> {
    const transaction = await this.createWriteTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = store.delete(entityId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error!);
    });
  }

  protected async deleteAll(storeName: StoreName): Promise<void> {
    const transaction = await this.createWriteTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error!);
    });
  }

  protected async createReadTransaction(storeName: StoreName): Promise<IDBTransaction> {
    const db = await this.getDb();
    return db.transaction(storeName, 'readonly');
  }

  protected async createWriteTransaction(
    storeName: StoreName | Iterable<StoreName>,
  ): Promise<IDBTransaction> {
    const db = await this.getDb();
    return db.transaction(storeName, 'readwrite');
  }

  protected async deleteAllByIndex(
    storeName: StoreName,
    indexName: IndexName,
    key: IDBValidKey,
  ): Promise<void> {
    const tx = await this.createWriteTransaction([storeName]);

    return new Promise((resolve, reject) => {
      tx.oncomplete = (): void => resolve();
      tx.onerror = (): void => reject(tx.error);
      tx.onabort = (): void => reject(tx.error);

      const store = tx.objectStore(storeName);
      const index = store.index(indexName);

      const cursorRequest = index.openCursor(IDBKeyRange.only(key));

      cursorRequest.onsuccess = (): void => {
        const cursor = cursorRequest.result;

        if (!cursor) {
          return;
        }

        cursor.delete();
        cursor.continue();
      };

      cursorRequest.onerror = (): void => reject(cursorRequest.error);
    });
  }

  private responseFromRequest<T>(request: IDBRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error!);
    });
  }
}
