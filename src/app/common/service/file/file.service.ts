import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileService {
  public checkQuota(): Promise<StorageEstimate> {
    return navigator.storage.estimate();
  }

  public async persist(name: string, data: Blob): Promise<void> {
    const directoryHandle = await navigator.storage.getDirectory();
    const fileHandle = await directoryHandle.getFileHandle(name, { create: true });

    const writable = await fileHandle.createWritable();

    try {
      await writable.write(data);
    } finally {
      await writable.close();
    }
  }

  public async get(name: string): Promise<File> {
    const directoryHandle = await navigator.storage.getDirectory();
    const fileHandle = await directoryHandle.getFileHandle(name);
    return fileHandle.getFile();
  }

  public async getMany(names: string[]): Promise<File[]> {
    const directoryHandle = await navigator.storage.getDirectory();
    const fileHandles = await Promise.all(names.map((name) => directoryHandle.getFileHandle(name)));
    return Promise.all(fileHandles.map((fileHandle) => fileHandle.getFile()));
  }
}
