import { inject, Injectable } from '@angular/core';
import { MediaRepository } from '@persistence/repository/media.repository';
import { ZipService, ZipStructure } from '@common/service/zip/zip.service';
import { FileService } from '@common/service/file/file.service';
import { Database } from '@infrastructure/database';
import { ZipOptions } from 'fflate';

@Injectable({ providedIn: 'root' })
export class ExportDataService {
  private readonly mediaRepository = inject(MediaRepository);
  private readonly zipService = inject(ZipService);
  private readonly fileService = inject(FileService);
  private readonly databaseConnection = inject(Database);

  public async exportData(): Promise<void> {
    const media = await this.mediaRepository.getAll();

    const files: File[] = await (media.length
      ? this.fileService.getMany(media.map((entry) => `${entry.exerciseId}-${entry.id}.jpeg`))
      : Promise.resolve([]));
    const fileBytes = await Promise.all(files.map((file) => file.bytes()));
    const db = await this.databaseConnection.export();

    const zipStructure: ZipStructure = {
      'upgradedb.sqlite3': [new Uint8Array(db), { level: 0 }],
      images: fileBytes.reduce(
        (directory, fileByte, index) => {
          const mediaEntry = media[index];
          const fileName = `${mediaEntry.exerciseId}-${mediaEntry.id}.jpeg`;
          return {
            ...directory,
            [fileName]: [fileByte, { level: 0 }],
          };
        },
        {} as Record<string, [Uint8Array<ArrayBufferLike>, ZipOptions]>,
      ),
    };

    const zipFile = this.zipService.zip(zipStructure);

    const handle = await window.showSaveFilePicker({
      suggestedName: `upgrade-backup-${Temporal.Now.plainDateISO().toString()}`,
      types: [
        {
          description: 'Upgrade Backup ZIP',
          accept: {
            'application/zip': ['.zip'],
          },
        },
      ],
    });
    const writableStream = await handle.createWritable();

    try {
      await writableStream.write(zipFile);
    } finally {
      await writableStream.close();
    }
  }
}
