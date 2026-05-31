import { Command } from '../command';
import { Session } from '../../../domain/model/session/session.model';

export class DeleteSessionCommand extends Command {
  constructor(public readonly session: Session) {
    super();
  }
}
