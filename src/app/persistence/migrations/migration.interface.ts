export interface Migration {
  apply(db: IDBDatabase, tx: IDBTransaction): void;
}

export type Migrations = Record<number, Migration>;
