import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseForm } from './exercise-form';

describe('ExerciseForm', () => {
  let component: ExerciseForm;
  let fixture: ComponentFixture<ExerciseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
