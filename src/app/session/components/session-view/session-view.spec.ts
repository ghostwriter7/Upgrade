import { ComponentFixture, TestBed } from '@angular/core/testing';

import SessionView from './session-view';
import { Component, input } from '@angular/core';
import { ExerciseLog, Session } from '../../../domain/model/session.model';
import { SessionHeader } from '../session-header/session-header';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionActions } from '../session-actions/session-actions';
import { SESSION } from '../../consts/session.token';

@Component({
  selector: 'app-session-header',
  template: '<div>Session Header</div>',
})
class SessionHeaderMock {
  public isNew = input<boolean>(false);
  public session = input<Session | null>(null);
}

@Component({
  selector: 'app-exercise-card',
  template: '<div>Exercise Card</div>',
})
class ExerciseCardMock {
  public entry = input<ExerciseLog>();
  public isNonDeletable = input(false);
}

@Component({
  selector: 'app-session-actions',
  template: '<div>Session Actions</div>',
})
class SessionActionsMock {}

describe('SessionView', () => {
  let component: SessionView;
  let fixture: ComponentFixture<SessionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionView],
      providers: [{ provide: SESSION, useValue: Session.createEmpty() }],
    })
      .overrideComponent(SessionView, {
        add: { imports: [SessionHeaderMock, ExerciseCardMock, SessionActionsMock] },
        remove: { imports: [SessionHeader, ExerciseCard, SessionActions] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SessionView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
