import { Command } from '@common/routers/command/command';

export class DownloadImageCommand extends Command {
  constructor(public readonly blob: Blob, public readonly exerciseLogId: string) {
    super();
  }
}
