import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekProgress } from './week-progress';

describe('WeekProgress', () => {
  let component: WeekProgress;
  let fixture: ComponentFixture<WeekProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekProgress],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
