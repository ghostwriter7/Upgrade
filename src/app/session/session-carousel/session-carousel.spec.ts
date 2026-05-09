import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCarousel } from './session-carousel';

describe('SessionCarousel', () => {
  let component: SessionCarousel;
  let fixture: ComponentFixture<SessionCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionCarousel],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
