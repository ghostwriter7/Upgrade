import { vi, expect } from 'vitest';
import { IndexName } from '@persistence/repository/index-name.enum';

export const mockDatabase = (config: { storeExists: boolean }) => ({
  objectStoreNames: {
    contains: vi.fn().mockReturnValue(config.storeExists),
  },
  createObjectStore: vi.fn(),
});

export const mockStore = (params: { existingIndexes?: IndexName[] } = {}) => {
  const store = {
    getAll: vi.fn(),
    indexNames: {
      contains: vi
        .fn()
        .mockImplementation((indexName: IndexName) => params.existingIndexes?.includes(indexName)),
    },
    createIndex: vi.fn(),
  };

  return {
    store,
    assertIndexCheck: (index: number, indexName: IndexName) =>
      expect(store.indexNames.contains).toHaveBeenNthCalledWith(index, indexName),
    assertNoCreateIndex: () => expect(store.createIndex).not.toHaveBeenCalled(),
    assertCreateIndex: (
      index: number,
      indexName: IndexName,
      fields: IDBValidKey,
      config: { unique: boolean } = { unique: false },
    ) => expect(store.createIndex).toHaveBeenNthCalledWith(index, indexName, fields, config),
  };
};

export const mockTx = (storeMock: ReturnType<typeof mockStore>['store']) => ({
  objectStore: vi.fn().mockReturnValueOnce(storeMock),
});
