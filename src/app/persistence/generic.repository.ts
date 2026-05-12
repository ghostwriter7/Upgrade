import { inject } from '@angular/core';
import { DATABASE_TOKEN } from './database.token';
import { firstValueFrom } from 'rxjs';
import { StoreName } from './store-name.enum';

export abstract class GenericRepository<T> {
  private readonly db = inject(DATABASE_TOKEN);

  protected async getDb(): Promise<IDBDatabase> {
    return firstValueFrom(this.db);
  }

  protected async findAll(storeName: StoreName): Promise<unknown[]> {
    const transaction = await this.createReadTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error!);
    });
  }

  protected async put(storeName: StoreName, entity: T): Promise<void> {
    const transaction = await this.createWriteTransaction(storeName);
    const store = transaction.objectStore(storeName);
    const request = store.put(entity);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error!);
    });
  }

  protected async delete(storeName: StoreName, entityId: string): Promise<boolean> {
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

  protected async createWriteTransaction(storeName: StoreName): Promise<IDBTransaction> {
    const db = await this.getDb();
    return db.transaction(storeName, 'readwrite');
  }

}
