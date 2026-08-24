import { Migration } from '@persistence/migrations/migration.interface';
import { StoreName } from '@persistence/repository/store-name.enum';

export class CreateTargetStore implements Migration {
  public apply(db: IDBDatabase, tx: IDBTransaction): void {
    if (!db.objectStoreNames.contains(StoreName.TARGETS)) {
      db.createObjectStore(StoreName.TARGETS, { keyPath: 'id' });
    }
  }
}
