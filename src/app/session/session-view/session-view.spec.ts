import { ComponentFixture, TestBed } from '@angular/core/testing';

import SessionView from './session-view';

describe('SessionView', () => {
  let component: SessionView;
  let fixture: ComponentFixture<SessionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionView],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
