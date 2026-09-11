/// <reference lib="webworker" />
import sqlite3InitModule, { type OpfsDatabase, type Sqlite3Static } from '@sqlite.org/sqlite-wasm';
import { SqlRequest } from '@infrastructure/sql-request.interface';
import { Changelog } from './changelog';

const databaseName = 'upgradedb';

addEventListener('message', ({ data }: MessageEvent<SqlRequest>) => {
  const response = `worker response to ${data}`;
  postMessage(response);
});

const start = (sqlite3: Sqlite3Static) => {
  console.log('Running SQLite3 version', sqlite3.version.libVersion);
  const db = new sqlite3.oo1.OpfsDb(`/${databaseName}.sqlite3`);
  console.log(`Created persisted database at ${db.filename}`);

  applyMigrations(db);
};

const initializeSqlLite = async () => {
  try {
    console.log('Loading and initializing SQLite3 module...');
    const sqlite3 = await sqlite3InitModule();
    start(sqlite3);
    console.log('SQLite3 module loaded and initialized.');
  } catch (err) {
    console.error('Initialization error:', err);
  }
};

const applyMigrations = (db: OpfsDatabase) => {
  db.exec('create table if not exists schema_version (version integer not null);');
  const currentVersionResult = db.selectValue('select version from schema_version limit 1') as
    | number
    | undefined;
  if (currentVersionResult === undefined) {
    db.exec('insert into schema_version (version) values (0)');
  }

  const currentVersion = Number.isInteger(currentVersionResult) ? currentVersionResult! : 0;
  let latestVersion = currentVersion;

  db.transaction(() => {
    for (const changelog of Changelog) {
      if (changelog.version > currentVersion) {
        for (const change of changelog.changes) {
          db.exec(change);
        }
        latestVersion = Math.max(latestVersion, changelog.version);
      }
    }

    if (latestVersion !== currentVersion) {
      db.exec(`update schema_version set version = ${latestVersion};`);
    }
  });
};

initializeSqlLite();
