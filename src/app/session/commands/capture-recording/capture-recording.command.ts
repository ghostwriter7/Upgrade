import { Command } from '@common/routers/command/command';

export class CaptureRecordingCommand extends Command {
  constructor(
    public readonly image: Blob,
    public readonly width: number,
    public readonly height: number,
    public readonly exerciseId: string
  ) {
    super();
  }
}
