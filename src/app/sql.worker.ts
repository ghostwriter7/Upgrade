/// <reference lib="webworker" />
import sqlite3InitModule, {
  BindingSpec,
  type OpfsDatabase,
  type Sqlite3Static,
  SqlValue,
} from '@sqlite.org/sqlite-wasm';
import { RequestType } from '@infrastructure/sql-request.interface';
// @ts-ignore
import changelog from './changelog.sql' with { type: 'text' };

const databaseName = 'upgradedb';

let sqlite3: Sqlite3Static | null = null;
let db: OpfsDatabase | null = null;
const requests: RequestType[] = [];

addEventListener('message', ({ data }: MessageEvent<RequestType>) => {
  if (!db) {
    requests.push(data);
    return;
  }

  handleRequest(data);
});

const ref = setInterval(() => {
  if (requests.length) {
    if (db) {
      clearInterval(ref);
      for (const request of requests) {
        handleRequest(request);
      }
    }
  } else {
    clearInterval(ref);
  }
}, 100);

function handleRequest(data: RequestType): void {
  if (data.type === 'export-db') {
    const array = sqlite3!.capi.sqlite3_js_db_export(db!);
    postMessage({ id: data.id, type: 'success', result: array.buffer }, [array.buffer]);
  } else if (data.type === 'query') {
    const result = queryMany(db!, data.sql, data.params);
    postMessage({ id: data.id, type: 'success', result });
  } else if (data.type === 'query-one') {
    const result = db!.selectObject(data.sql, data.params);
    postMessage({ id: data.id, type: 'success', result });
  } else if (data.type === 'execute') {
    execute(db!, data.sql, data.params);
    postMessage({ id: data.id, type: 'success' });
  }
}

const start = async (sqlite3: Sqlite3Static) => {
  console.log('Running SQLite3 version', sqlite3.version.libVersion);
  const filename = `${databaseName}.sqlite3`;

  // try {
  //   // TODO Remove it once schema migration is complete
  //   const root = await navigator.storage.getDirectory();
  //   await root.removeEntry(filename);
  // } catch (err) {}

  db = new sqlite3.oo1.OpfsDb(filename, 'wc');
  console.log(`Created persisted database at ${db.filename}`);
  applyMigrations(db);
};

const initializeSqlLite = async () => {
  try {
    console.log('Loading and initializing SQLite3 module...');
    sqlite3 = await sqlite3InitModule();
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
    const changes = (changelog as string)
      .split(/^-- @changeset \d+\s*$/m)
      .map((change) => change.trim())
      .filter(Boolean);

    for (let i = 0; i < changes.length; i++) {
      if (i + 1 > currentVersion) {
        db.exec(changes[i]);
        latestVersion++;
      }
    }

    if (latestVersion !== currentVersion) {
      db.exec(`update schema_version set version = ${latestVersion};`);
    }
  });
};

initializeSqlLite();

function queryMany(
  db: OpfsDatabase,
  sql: string,
  params?: BindingSpec,
): Record<string, SqlValue>[] {
  return db.selectObjects(sql, formatParams(params));
}

function execute(db: OpfsDatabase, sql: string, params?: BindingSpec): void {
  const ps = db.prepare(sql);

  try {
    if (params) {
      ps.bind(formatParams(params));
    }

    ps.stepFinalize();
  } catch (error) {
    ps.finalize();
    throw error;
  }
}

function formatParams(params?: BindingSpec): BindingSpec {
  if (!params) return {};

  if (Array.isArray(params)) return params;

  return Object.fromEntries(Object.entries(params).map(([key, value]) => [`:${key}`, value]));
}
