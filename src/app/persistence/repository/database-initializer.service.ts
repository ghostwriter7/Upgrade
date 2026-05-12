import { DatabaseVersion } from './database-version.const';
import { Observable, ReplaySubject } from 'rxjs';
import { StoreName } from './store-name.enum';
import { IndexName } from './index-name.enum';

export function databaseFactory(): Observable<IDBDatabase> {
  const db = indexedDB.open('upgrade', DatabaseVersion);
  const databaseSubject = new ReplaySubject<IDBDatabase>(1);

  db.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
    const db: IDBDatabase = (event.target as IDBRequest).result;

    console.log(`Upgrading to version ${db.version}`);

    const existingObjectStores = db.objectStoreNames;
    if (!existingObjectStores.contains('sessions')) {
      const store = db.createObjectStore(StoreName.SESSIONS, { keyPath: 'uuid' });
      store.createIndex(IndexName.StartedAt, 'startedAt', { unique: false });
    }
  };

  db.onsuccess = (event: Event): void => databaseSubject.next(db.result);

  db.onerror = (event: Event): void =>
    databaseSubject.error(new Error('Database initialization error'));

  return databaseSubject.asObservable();
}
