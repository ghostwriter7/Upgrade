import { inject, Injectable } from '@angular/core';
import { ZipService } from '@common/service/zip/zip.service';
import { FileService } from '@common/service/file/file.service';
import { Database } from '@infrastructure/database';

@Injectable({ providedIn: 'root' })
export class ImportDataService {
  private readonly zipService = inject(ZipService);
  private readonly fileService = inject(FileService);
  private readonly database = inject(Database);

  public async importDatabase(): Promise<void> {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Upgrade DB',
          accept: {
            'application/octet-stream': ['.sqlite3'],
          },
        },
      ],
    });

    const file = await handle.getFile();
    const bytes = await file.arrayBuffer();

    await this.database.import(bytes);
  }

  public async importData(): Promise<void> {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'ZIP Files',
          accept: {
            'application/zip': ['.zip'],
          },
        },
      ],
    });
    const zipContent = await this.zipService.unzip(await handle.getFile());

    await this.handleImages(zipContent);
  }

  private handleImages(zipContent: Record<string, Uint8Array<ArrayBuffer>>): Promise<void[]> {
    const images = Object.entries(zipContent)
      .filter((entry) => entry[0].startsWith('images/') && !!entry[1].byteLength)
      .map((entry) => ({
        name: entry[0].replace('images/', ''),
        bytes: entry[1],
      }));

    return Promise.all(
      images.map(async (data) => {
        if (await this.fileService.exists(data.name)) return;
        return this.fileService.persist(data.name, data.bytes);
      }),
    );
  }
}
