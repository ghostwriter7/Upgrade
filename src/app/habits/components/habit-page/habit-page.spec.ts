import { ComponentFixture, TestBed } from '@angular/core/testing';

import HabitPage from './habit-page';

describe('HabitPage', () => {
  let component: HabitPage;
  let fixture: ComponentFixture<HabitPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
