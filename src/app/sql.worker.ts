/// <reference lib="webworker" />
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  postMessage(response);
});

const initializeSqlLite = async () => {
  try {
    console.log('Loading and initializing SQLite3 module...');
    const sqlite3 = await sqlite3InitModule();
    console.log('SQLite3 module loaded and initialized.');
  } catch (err) {
    console.error('Initialization error:', err);
  }
};

initializeSqlLite();
