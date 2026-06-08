import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseLogSummary } from './exercise-log-summary';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';

describe('ExerciseLogSummary', () => {
  let component: ExerciseLogSummary;
  let fixture: ComponentFixture<ExerciseLogSummary>;

  const log = new ExerciseLog('sessionId', 'exerciseId');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseLogSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseLogSummary);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('exerciseLog', log);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
