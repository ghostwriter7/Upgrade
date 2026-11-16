import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitForm } from './habit-form';

describe('HabitForm', () => {
  let component: HabitForm;
  let fixture: ComponentFixture<HabitForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
