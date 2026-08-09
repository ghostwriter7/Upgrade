import { inject, Service } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { Constructor } from '@common/types/constructor.type';
import { DownloadImageCommand } from '@session/commands/download-image/download-image.command';
import { DateHelper } from '@common/helper/date.helper';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';

@Service()
export class DownloadImageCommandHandler implements CommandHandler<DownloadImageCommand> {
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public appliesTo(): Constructor<DownloadImageCommand> {
    return DownloadImageCommand;
  }

  public async handle({ blob, exerciseLogId }: DownloadImageCommand): Promise<void> {
    const exerciseLog = await this.exerciseLogRepository.findLogById(exerciseLogId);

    if (!exerciseLog) return;

    const handle = await this.getHandle(exerciseLog.exerciseId, exerciseLog.createdAt);

    if (!handle) return;

    const writable = await handle.createWritable();

    try {
      await writable.write(blob);
      await writable.close();
    } catch (error) {
      await writable.abort();
    }
  }

  private async getHandle(
    exerciseId: string,
    createdAt: Temporal.Instant,
  ): Promise<FileSystemFileHandle | null> {
    try {
      return await window.showSaveFilePicker({
        suggestedName: `${DateHelper.toLocal(createdAt.round({ smallestUnit: 'minutes' })).toPlainDate()}-${exerciseId}.jpeg`,
        types: [
          {
            accept: {
              ['image/jpeg']: ['.jpeg'],
            },
          },
        ],
      });
    } catch {
      return null;
    }
  }
}
