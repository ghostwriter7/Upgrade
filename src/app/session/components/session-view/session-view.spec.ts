import { ComponentFixture, TestBed } from '@angular/core/testing';

import SessionView from './session-view';
import { Session } from '../../../domain/model/session.model';
import { SessionHeader } from '../session-header/session-header';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionHeaderMock } from '../../../../test/mocks/session-header.mock';
import { ExerciseCardMock } from '../../../../test/mocks/exercise-card.mock';

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
