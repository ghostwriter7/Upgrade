import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCardActions } from './exercise-card-actions';

describe('ExerciseCardActions', () => {
  let component: ExerciseCardActions;
  let fixture: ComponentFixture<ExerciseCardActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseCardActions],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseCardActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
