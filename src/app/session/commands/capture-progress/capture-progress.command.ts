import { Command } from '@common/routers/command/command';
import { Point } from '@domain/model/measurement.model';

export class CaptureProgressCommand extends Command {
  constructor(
    public readonly exerciseId: string,
    public readonly image: Blob,
    public readonly width: number,
    public readonly height: number,
    public readonly angle?: number,
    public readonly points?: Point[],
  ) {
    super();
  }
}
