import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Session } from '../../../domain/model/session/session.model';
import { Router } from '@angular/router';
import { DateHelper } from '../../../common/helper/date.helper';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { EditTime } from '../edit-time/edit-time';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { PatchStartedAtCommand } from '../../commands/patch-started-at/patch-started-at.command';
import { CommandBus } from '../../routers/command-bus';
import { PatchFinishedAtCommand } from '../../commands/patch-finished-at/patch-finished-at.command';
import { DeleteSessionCommand } from '../../commands/delete-session/delete-session-command';

@Component({
  selector: 'app-session-header',
  imports: [MatFabButton, MatIcon, MatMiniFabButton, MatMenu, MatMenuItem, MatMenuTrigger],
  templateUrl: './session-header.html',
  providers: [DialogService],
  styleUrl: './session-header.css',
})
export class SessionHeader {
  public isNew = input.required<boolean>();
  public session = input.required<Session>();

  protected readonly showEdit = linkedSignal(() => !this.isNew());
  protected readonly testIds = {
    editMenuOption: 'session-header-edit-menu-option',
    deleteMenuOption: 'session-header-delete-menu-option',
    startedAt: 'session-header-started-at',
    startedAtValue: 'session-header-started-at-value',
    finishedAt: 'session-header-finished-at',
    finishedAtValue: 'session-header-finished-at-value',
    duration: 'session-header-duration',
    menu: 'session-header-menu',
  };
  protected readonly startedAt = computed(() =>
    DateHelper.toLocal(this.session().startedAt).toLocaleString('en-GB', { timeStyle: 'short' }),
  );
  protected readonly finishedAt = computed(() => {
    const finishedAt = this.session()?.finishedAt;
    return finishedAt
      ? DateHelper.toLocal(finishedAt).toLocaleString('en-GB', { timeStyle: 'short' })
      : null;
  });
  protected readonly duration = computed(() => {
    const { startedAt, finishedAt } = this.session();

    if (!finishedAt) return null;

    const duration = DateHelper.toLocal(finishedAt).since(DateHelper.toLocal(startedAt));
    const { hours, minutes } = duration;

    if (hours) return `${hours}h ${minutes}m`;

    return `${minutes}m`;
  });

  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly commandBus = inject(CommandBus);

  protected deleteSession(): void {
    this.dialog.open(ConfirmDeleteAlert, () =>
      this.commandBus.dispatch(new DeleteSessionCommand(this.session())),
    );
  }

  protected editStartedAt(): void {
    this.dialog.open(
      EditTime,
      (result: Temporal.Instant) => this.commandBus.dispatch(new PatchStartedAtCommand(result)),
      {
        data: { instant: this.session().startedAt, label: 'Edit Started At' },
      },
    );
  }

  protected editFinishedAt(): void {
    this.dialog.open(
      EditTime,
      (result: Temporal.Instant) => this.commandBus.dispatch(new PatchFinishedAtCommand(result)),
      {
        data: { instant: this.session().finishedAt, label: 'Edit Finished At' },
      },
    );
  }

  protected triggerEdit(): void {
    this.sessionStateHolder.set(this.session());
    this.router.navigate(['/session/edit']);
  }
}
