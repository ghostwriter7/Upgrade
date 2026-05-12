import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
} from '@angular/core';
import { SessionStore } from '../../store/session.store';
import { Loader } from '../../ui/loader/loader';
import SessionView from '../session-view/session-view';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-list',
  imports: [Loader, SessionView],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css',
})
export class SessionList {
  public date = input.required<TemporalType.ZonedDateTime>();

  private readonly sessionStore = inject(SessionStore);

  private readonly sessionResource = resource({
    params: () => ({ date: this.date() }),
    loader: ({ params }) => this.sessionStore.getAllSessionsByDate(params.date),
  });

  protected readonly isLoading = this.sessionResource.isLoading;
  protected readonly sessions = computed(() => {
    if (this.sessionResource.hasValue()) {
      return this.sessionResource.value();
    }
    return [];
  });
}
