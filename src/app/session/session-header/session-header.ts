import { Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Session } from '../../domain/model/session.model';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateHelper } from '../../common/helper/date.helper';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { SessionStore } from '../../store/session/session.store';
import { EditTime } from '../edit-time/edit-time';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

@Component({
  selector: 'app-session-header',
  imports: [MatFabButton, MatIcon, MatMiniFabButton],
  templateUrl: './session-header.html',
  styleUrl: './session-header.css',
})
export class SessionHeader {
  public isNew = input.required<boolean>();
  public session = input.required<Session>();
  public startedAtChange = output<TemporalType.Instant>();
  public finishedAtChange = output<TemporalType.Instant>();

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

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionStore = inject(SessionStore);
  private readonly router = inject(Router);

  protected deleteSession(): void {
    const ref = this.dialog.open(ConfirmDeleteAlert);

    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          if (this.isNew()) {
            this.router.navigate(['/']);
          } else {
            this.sessionStore.delete(this.session());
          }
        }
      });
  }

  protected editStartedAt(): void {
    const ref: MatDialogRef<EditTime, TemporalType.Instant> = this.dialog.open(EditTime, {
      data: { instant: this.session().startedAt, label: 'Edit Started At' },
    });

    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.startedAtChange.emit(result);
        }
      });
  }

  protected editFinishedAt(): void {
    const ref: MatDialogRef<EditTime, TemporalType.Instant> = this.dialog.open(EditTime, {
      data: { instant: this.session().finishedAt, label: 'Edit Finished At' },
    });

    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.finishedAtChange.emit(result);
        }
      });
  }
}
