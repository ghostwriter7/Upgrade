import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHeader } from './session-header';

describe('SessionHeader', () => {
  let component: SessionHeader;
  let fixture: ComponentFixture<SessionHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
