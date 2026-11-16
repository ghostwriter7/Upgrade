import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitHeader } from './habit-header';

describe('HabitHeader', () => {
  let component: HabitHeader;
  let fixture: ComponentFixture<HabitHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
