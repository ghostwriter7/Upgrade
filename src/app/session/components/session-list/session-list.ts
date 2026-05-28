import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SessionStore } from '../../../store/session/session.store';
import { Loader } from '../../../ui/loader/loader';
import SessionView from '../session-view/session-view';
import { MatIcon } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-list',
  imports: [Loader, SessionView, MatIcon],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css',
})
export class SessionList {
  public date = input.required<Temporal.ZonedDateTime>();

  private readonly sessionStore = inject(SessionStore);

  protected readonly sessions = this.sessionStore.activeSessions;
  protected readonly loading = this.sessionStore.loading;
}
