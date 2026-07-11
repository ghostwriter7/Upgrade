import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseView } from './exercise-view';

describe('ExerciseView', () => {
  let component: ExerciseView;
  let fixture: ComponentFixture<ExerciseView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseView],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
