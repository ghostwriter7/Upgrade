import { Service } from '@angular/core';
import { unzipSync, Zippable, zipSync } from 'fflate';

@Service()
export class ZipService {
  public zip(payload: Zippable): Uint8Array<ArrayBuffer> {
    return zipSync(payload);
  }

  public unzip(payload: Uint8Array<ArrayBuffer>): Record<string, Uint8Array<ArrayBuffer>> {
    return unzipSync(payload);
  }
}
