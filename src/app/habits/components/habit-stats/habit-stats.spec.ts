import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitStats } from './habit-stats';

describe('HabitStats', () => {
  let component: HabitStats;
  let fixture: ComponentFixture<HabitStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitStats],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
