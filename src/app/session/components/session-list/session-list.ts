import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  signal,
  untracked,
} from '@angular/core';
import { SessionStore } from '../../../store/session/session.store';
import { Loader } from '../../../ui/loader/loader';
import SessionView from '../session-view/session-view';
import { NgComponentOutlet } from '@angular/common';
import { SESSION } from '../../consts/session.token';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-list',
  imports: [Loader, NgComponentOutlet],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css',
})
export class SessionList {
  public date = input.required<TemporalType.ZonedDateTime>();

  private readonly sessionStore = inject(SessionStore);

  protected readonly injectors = signal<Injector[]>([]);
  protected readonly loading = this.sessionStore.loading;
  protected readonly sessionViewComponent = SessionView;

  constructor() {
    const injector = inject(Injector);
    effect(() => {
      this.date();
      const loading = this.loading();

      if (!loading) {
        const sessions = this.sessionStore.activeSessions();
        untracked(() => {
          const injectors = this.injectors();

          if (
            injectors.length !== sessions?.length ||
            injectors.some(
              (injector, index) => injector.get(SESSION).uuid !== sessions?.[index].uuid,
            )
          ) {
            this.injectors.set(
              sessions?.map((session) =>
                Injector.create({
                  parent: injector,
                  providers: [{ provide: SESSION, useValue: session }],
                }),
              ) || [],
            );
          }
        });
      }
    });
  }
}
