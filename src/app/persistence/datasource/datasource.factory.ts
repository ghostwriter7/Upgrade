import { DatabaseVersion } from '../repository/database-version.const';
import { Observable, ReplaySubject } from 'rxjs';
import { Migrations } from '@persistence/migrations/migration.interface';

export function datasourceFactory(migrations: Migrations): Observable<IDBDatabase> {
  const db = indexedDB.open('upgrade', DatabaseVersion);
  const databaseSubject = new ReplaySubject<IDBDatabase>(1);

  db.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
    const { result: db, transaction: tx } = event.target as IDBRequest;

    const oldVersion = event.oldVersion;

    console.log(`Upgrading to version ${db.version}`);

    for (let version = oldVersion + 1; version <= DatabaseVersion; version++) {
      migrations[version]?.apply(db, tx!);
    }
  };

  db.onsuccess = (event: Event): void => databaseSubject.next(db.result);

  db.onerror = (event: Event): void =>
    databaseSubject.error(new Error('Database initialization error'));

  return databaseSubject.asObservable();
}
