import { Migration } from '@persistence/migrations/migration.interface';
import { StoreName } from '@persistence/repository/store-name.enum';

export class CreateTemplateStores implements Migration {
  public apply(db: IDBDatabase, tx: IDBTransaction): void {
    if (!db.objectStoreNames.contains(StoreName.TEMPLATES)) {
      db.createObjectStore(StoreName.TEMPLATES, { keyPath: 'id' });
    }
  }
}
