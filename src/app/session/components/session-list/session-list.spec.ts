import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionList } from './session-list';
import { Component, input, signal, WritableSignal } from '@angular/core';
import { Session } from '../../../domain/model/session/session.model';
import { SessionStore } from '../../../store/session/session.store';
import { Loader } from '../../../ui/loader/loader';
import SessionView from '../session-view/session-view';

@Component({
  selector: 'app-loader',
  template: '<div>Loading...</div>',
})
class LoaderMock {}

@Component({
  selector: 'app-session-view',
  template: '<div>Session View</div>',
})
class SessionViewMock {
  public session = input.required<Session>();
}

describe('SessionList', () => {
  let component: SessionList;
  let fixture: ComponentFixture<SessionList>;
  let sessionStore: { activeSessions: WritableSignal<Session[]>; loading: WritableSignal<boolean> };

  beforeEach(async () => {
    sessionStore = {
      activeSessions: signal([]),
      loading: signal(false),
    };
    await TestBed.configureTestingModule({
      imports: [SessionList],
      providers: [{ provide: SessionStore, useValue: sessionStore }],
    })
      .overrideComponent(SessionList, {
        add: { imports: [LoaderMock, SessionViewMock] },
        remove: { imports: [Loader, SessionView] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SessionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
