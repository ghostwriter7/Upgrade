import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesControl } from './exercises-control';

describe('ExercisesControl', () => {
  let component: ExercisesControl;
  let fixture: ComponentFixture<ExercisesControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesControl],
    }).compileComponents();

    fixture = TestBed.createComponent(ExercisesControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
