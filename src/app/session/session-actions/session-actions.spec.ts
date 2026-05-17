import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionActions } from './session-actions';

describe('SessionActions', () => {
  let component: SessionActions;
  let fixture: ComponentFixture<SessionActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionActions],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
