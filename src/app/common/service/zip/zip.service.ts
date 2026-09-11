import { Service } from '@angular/core';
import { unzipSync, Zippable, zipSync } from 'fflate';

export type ZipStructure = Zippable;

@Service()
export class ZipService {
  public zip(payload: ZipStructure): Uint8Array<ArrayBuffer> {
    return zipSync(payload);
  }

  public async unzip(file: File): Promise<Record<string, Uint8Array<ArrayBuffer>>> {
    const bytes = await file.bytes();
    return unzipSync(bytes);
  }
}
