import { Component, computed, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatMiniFabButton } from '@angular/material/button';
import { CommandBus } from '@common/routers/command/command-bus';
import { Router } from '@angular/router';
import { SessionStateHolder } from '@session/store/session-state-holder.store';
import { DialogService } from '@common/service/dialog/dialog.service';
import { ConfirmDeleteAlert } from '@session/components/confirm-delete-alert/confirm-delete-alert.component';
import { DeleteSessionCommand } from '@session/commands/delete-session/delete-session-command';
import { Session } from '@domain/model/session/session.model';

@Component({
  selector: 'app-session-header-menu',
  imports: [MatIcon, MatMenu, MatMenuItem, MatMiniFabButton, MatMenuTrigger],
  templateUrl: './session-header-menu.html',
  styleUrl: './session-header-menu.css',
})
export class SessionHeaderMenu {
  public session = input.required<Session>();
  public isNew = input.required<boolean>();

  protected readonly showEdit = computed(() => !this.isNew());
  protected readonly testIds = {
    edit: 'session-header-edit-menu-option',
    delete: 'session-header-delete-menu-option',
    menu: 'session-header-menu',
  };

  private readonly router = inject(Router);
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly dialog = inject(DialogService);
  private readonly commandBus = inject(CommandBus);

  protected deleteSession(): void {
    this.dialog.open(ConfirmDeleteAlert, () =>
      this.commandBus.dispatch(new DeleteSessionCommand(this.session())),
    );
  }

  protected triggerEdit(): void {
    this.sessionStateHolder.set(this.session());
    this.router.navigate(['/session/edit']);
  }
}
