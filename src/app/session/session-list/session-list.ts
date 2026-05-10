import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { SessionStore } from '../../store/session.store';
import { Session } from '../../domain/model/session.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Loader } from '../../ui/loader/loader';
import SessionView from '../session-view/session-view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-list',
  imports: [Loader, SessionView],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css',
})
export class SessionList {
  public date = input.required<string>();

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
