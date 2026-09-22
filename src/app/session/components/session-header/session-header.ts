import { Component, computed, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Session } from '@domain/model/session/session.model';
import { DateHelper } from '@common/helper/date.helper';
import { EditTime } from '../edit-time/edit-time';
import { DialogService } from '@common/service/dialog/dialog.service';
import { PatchStartedAtCommand } from '../../commands/patch-started-at/patch-started-at.command';
import { CommandBus } from '@common/routers/command/command-bus';
import { PatchFinishedAtCommand } from '../../commands/patch-finished-at/patch-finished-at.command';
import { SessionHeaderMenu } from '@session/components/session-header-menu/session-header-menu';
import { Constructor } from '@common/types/constructor.type';
import { ReactiveFormsModule } from '@angular/forms';
import { RpeInput } from '@session/components/rpe-input/rpe-input';
import { MatChip, MatChipAvatar, MatChipSet } from '@angular/material/chips';

@Component({
  selector: 'app-session-header',
  imports: [
    MatIcon,
    SessionHeaderMenu,
    ReactiveFormsModule,
    MatChipAvatar,
    RpeInput,
    MatChipSet,
    MatChip,
  ],
  templateUrl: './session-header.html',
  providers: [DialogService],
  styleUrl: './session-header.css',
})
export class SessionHeader {
  public isEditable = input(false);
  public isNew = input.required<boolean>();
  public session = input.required<Session>();

  protected readonly isNonEditable = computed(() => !this.isEditable());
  protected readonly testIds = {
    startedAt: 'session-header-started-at',
    startedAtValue: 'session-header-started-at-value',
    finishedAt: 'session-header-finished-at',
    finishedAtValue: 'session-header-finished-at-value',
    duration: 'session-header-duration',
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

  private readonly dialog = inject(DialogService);
  private readonly commandBus = inject(CommandBus);
  protected readonly showRpe = computed(() => this.session().rpe || this.isEditable());

  protected editStartedAt(): void {
    this.editTime(this.session().startedAt, 'Edit Started At', PatchStartedAtCommand);
  }

  protected editFinishedAt(): void {
    this.editTime(this.session().finishedAt, 'Edit Finished At', PatchFinishedAtCommand);
  }

  private editTime(
    instant: Temporal.Instant | null,
    label: string,
    command: Constructor<PatchFinishedAtCommand | PatchStartedAtCommand>,
  ) {
    this.dialog.open(
      EditTime,
      (result: Temporal.Instant) => this.commandBus.dispatch(new command(result)),
      { data: { instant, label } },
    );
  }
}
