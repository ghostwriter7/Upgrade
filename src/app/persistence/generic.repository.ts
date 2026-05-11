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
    const db = await this.getDb();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error!);
    });
  }

  protected async put(storeName: StoreName, entity: T): Promise<void> {
    const db = await this.getDb();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(entity);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error!);
    });
  }

}
