import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { UpdateSessionRpeCommand } from '@session/commands/update-session-rpe/update-session-rpe.command';
import { Constructor } from '@angular/cdk/schematics';
import { SessionStateHolder } from '@session/store/session-state-holder.store';
import { SessionRepository } from '@persistence/repository/session.repository';

@Injectable()
export class UpdateSessionRpeCommandHandler implements CommandHandler<UpdateSessionRpeCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<UpdateSessionRpeCommand> {
    return UpdateSessionRpeCommand;
  }

  public handle({ rpe }: UpdateSessionRpeCommand): void {
    const session = this.sessionStateHolder.session();

    if (session) {
      const updated = session.withRpe(rpe);
      this.sessionStateHolder.set(updated);
      this.sessionRepository.update(updated);
    }
  }
}
