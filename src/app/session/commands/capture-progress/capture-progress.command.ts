import { Command } from '@common/routers/command/command';
import { Point } from '@domain/model/measurement.model';

export class CaptureProgressCommand extends Command {
  constructor(
    public readonly image: Blob,
    public readonly width: number,
    public readonly height: number,
    public readonly angle: number,
    public readonly points: Point[],
    public readonly exerciseId: string
  ) {
    super();
  }
}
