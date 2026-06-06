import { datasourceFactory } from '@persistence/datasource/datasource.factory';
import { Migrations } from '@persistence/migrations/migration.interface';
import { Mock } from 'vitest';
import { DatabaseVersion } from '@persistence/repository/database-version.const';

describe('datasourceFactory', () => {
  let openMock: Mock;

  beforeEach(() => {
    openMock = vi.fn();
    globalThis.indexedDB = {
      open: openMock,
    } as unknown as IDBFactory;
  });

  const mockOpenIndexDB = ({ result }: { result?: IDBDatabase } = {}) => {
    const request = {
      onupgradeneeded: undefined,
      onsuccess: undefined,
      onerror: undefined,
      version: undefined,
      result,
    } as unknown as IDBOpenDBRequest;
    openMock.mockReturnValueOnce(request);
    return request;
  };

  const emptyMigrations: Migrations = {};

  it('should dispatch error when database initialization error occurs', () => {
    const mockedRequest = mockOpenIndexDB();

    const result$ = datasourceFactory(emptyMigrations);

    mockedRequest.onerror?.(new Event('any'));

    result$.subscribe({
      error: (e) => {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe('Database initialization error');
      },
    });
    expect(openMock).toHaveBeenCalledExactlyOnceWith('upgrade', DatabaseVersion);
    expect.assertions(3);
  });

  it('should dispatch an instance when initialization succeeds', () => {
    const mockDb = {} as IDBDatabase;
    const mockedRequest = mockOpenIndexDB({ result: mockDb });

    const result$ = datasourceFactory(emptyMigrations);

    mockedRequest.onsuccess?.(new Event('any'));

    result$.subscribe({
      next: (instance) => expect(instance).toBe(mockDb),
    });
    expect(openMock).toHaveBeenCalledExactlyOnceWith('upgrade', DatabaseVersion);
    expect.assertions(2);
  });

  const mockMigration = () => ({ apply: vi.fn() });

  it('should perform migrations from the old version forward', () => {
    const mockedRequest = mockOpenIndexDB();
    const mockedDb = {} as IDBDatabase;
    const mockedTx = {} as IDBTransaction;
    const migrations: Migrations = {
      1: mockMigration(),
      2: mockMigration(),
      3: mockMigration(),
      4: mockMigration(),
      5: mockMigration(),
    };

    datasourceFactory(migrations);

    mockedRequest.onupgradeneeded?.({
      oldVersion: 2,
      target: { result: mockedDb, transaction: mockedTx },
    } as unknown as IDBVersionChangeEvent);

    expect(openMock).toHaveBeenCalledExactlyOnceWith('upgrade', DatabaseVersion);
    expect(migrations[1].apply).not.toHaveBeenCalled();
    expect(migrations[2].apply).not.toHaveBeenCalled();
    expect(migrations[3].apply).toHaveBeenCalledExactlyOnceWith(mockedDb, mockedTx);
    expect(migrations[4].apply).toHaveBeenCalledExactlyOnceWith(mockedDb, mockedTx);
    expect(migrations[5].apply).toHaveBeenCalledExactlyOnceWith(mockedDb, mockedTx);
  });

  it('should apply all migrations', () => {
    const mockedRequest = mockOpenIndexDB();
    const mockedDb = {} as IDBDatabase;
    const mockedTx = {} as IDBTransaction;
    const migrations: Migrations = {
      1: mockMigration(),
      2: mockMigration(),
      3: mockMigration(),
    };

    datasourceFactory(migrations);

    mockedRequest.onupgradeneeded?.({
      oldVersion: 0,
      target: { result: mockedDb, transaction: mockedTx },
    } as unknown as IDBVersionChangeEvent);

    expect(openMock).toHaveBeenCalledExactlyOnceWith('upgrade', DatabaseVersion);
    expect(migrations[1].apply).toHaveBeenCalledExactlyOnceWith(mockedDb, mockedTx);
    expect(migrations[2].apply).toHaveBeenCalledExactlyOnceWith(mockedDb, mockedTx);
    expect(migrations[3].apply).toHaveBeenCalledExactlyOnceWith(mockedDb, mockedTx);
  });
});
