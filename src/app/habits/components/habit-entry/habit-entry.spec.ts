import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitEntry } from './habit-entry';

describe('HabitEntry', () => {
  let component: HabitEntry;
  let fixture: ComponentFixture<HabitEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
