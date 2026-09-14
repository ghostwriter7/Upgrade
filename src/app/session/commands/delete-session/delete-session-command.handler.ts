import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { inject, Injectable } from '@angular/core';
import { DeleteSessionCommand } from './delete-session-command';
import { SessionStore } from '@store/session/session.store';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { Constructor } from '@common/types/constructor.type';
import { Router } from '@angular/router';
import { SessionRepository } from '@persistence/repository/session.repository';

@Injectable()
export class DeleteSessionCommandHandler implements CommandHandler<DeleteSessionCommand> {
  private readonly sessionStore = inject(SessionStore);
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly router = inject(Router);
  private readonly sessionRepository = inject(SessionRepository);

  public appliesTo(): Constructor<DeleteSessionCommand> {
    return DeleteSessionCommand;
  }

  public handle({ session }: DeleteSessionCommand): void {
    this.sessionStore.delete(session);
    this.sessionStateHolder.set(null);

    this.sessionRepository.deleteById(session.id);

    const route = this.router.routerState.snapshot.url;
    if (route.includes('edit') || route.includes('new')) {
      this.router.navigateByUrl('/');
    }
  }
}
