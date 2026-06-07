import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseLogSummary } from './exercise-log-summary';

describe('ExerciseLogSummary', () => {
  let component: ExerciseLogSummary;
  let fixture: ComponentFixture<ExerciseLogSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseLogSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseLogSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
