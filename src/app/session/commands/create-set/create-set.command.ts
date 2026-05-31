import { Command } from '@common/routers/command/command';
import { SetData } from '../../components/set-form/set-data.interface';

export class CreateSetCommand extends Command {
  constructor(public readonly setData: SetData, public readonly exerciseId: string) {
    super();
  }
}
