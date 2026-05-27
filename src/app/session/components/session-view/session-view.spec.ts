import { ComponentFixture, TestBed } from '@angular/core/testing';

import SessionView from './session-view';
import { Component, input } from '@angular/core';
import { ExerciseLog, Session } from '../../../domain/model/session.model';
import { SessionHeader } from '../session-header/session-header';
import { ExerciseCard } from '../exercise-card/exercise-card';

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

describe('SessionView', () => {
  let component: SessionView;
  let fixture: ComponentFixture<SessionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionView],
    })
      .overrideComponent(SessionView, {
        add: { imports: [SessionHeaderMock, ExerciseCardMock] },
        remove: { imports: [SessionHeader, ExerciseCard] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SessionView);
    fixture.componentRef.setInput('session', Session.createEmpty());
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
