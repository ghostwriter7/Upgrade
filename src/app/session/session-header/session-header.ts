import { Component, computed, inject, input, output } from '@angular/core';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Session } from '../../domain/model/session.model';
import { Router } from '@angular/router';
import { DateHelper } from '../../common/helper/date.helper';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { SessionStore } from '../../store/session/session.store';
import { EditTime } from '../edit-time/edit-time';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { DialogService } from '../../common/service/dialog.service';

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
  public startedAtChange = output<TemporalType.Instant>();
  public finishedAtChange = output<TemporalType.Instant>();
  public editStart = output();

  protected readonly isFinal = computed(() => this.session().finishedAt !== null);
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

  private readonly sessionStore = inject(SessionStore);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);

  protected deleteSession(): void {
    this.dialog.open(ConfirmDeleteAlert, () => {
      if (this.isNew()) {
        this.router.navigate(['/']);
      } else {
        this.sessionStore.delete(this.session());
      }
    });
  }

  protected editStartedAt(): void {
    this.dialog.open(
      EditTime,
      (result: TemporalType.Instant) => this.startedAtChange.emit(result),
      {
        data: { instant: this.session().startedAt, label: 'Edit Started At' },
      },
    );
  }

  protected editFinishedAt(): void {
    this.dialog.open(
      EditTime,
      (result: TemporalType.Instant) => this.finishedAtChange.emit(result),
      {
        data: { instant: this.session().finishedAt, label: 'Edit Finished At' },
      },
    );
  }
}
