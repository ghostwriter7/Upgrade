import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPage } from './session-page';

describe('SessionPage', () => {
  let component: SessionPage;
  let fixture: ComponentFixture<SessionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
