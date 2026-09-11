/// <reference lib="webworker" />
import sqlite3InitModule, { type Sqlite3Static } from '@sqlite.org/sqlite-wasm';
import { SqlRequest } from '@infrastructure/sql-request.interface';

const databaseName = 'upgradedb';

addEventListener('message', ({ data }: MessageEvent<SqlRequest>) => {
  const response = `worker response to ${data}`;
  postMessage(response);
});

const start = (sqlite3: Sqlite3Static) => {
  console.log('Running SQLite3 version', sqlite3.version.libVersion);
  const db = new sqlite3.oo1.OpfsDb(`/${databaseName}.sqlite3`);
  console.log(`Created persisted database at ${db.filename}`);
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

initializeSqlLite();
