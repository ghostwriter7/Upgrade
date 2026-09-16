import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseEditor } from './exercise-editor';

describe('ExerciseEditor', () => {
  let component: ExerciseEditor;
  let fixture: ComponentFixture<ExerciseEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
