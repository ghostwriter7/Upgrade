import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDropdown } from './exercise-dropdown';

describe('ExerciseDropdown', () => {
  let component: ExerciseDropdown;
  let fixture: ComponentFixture<ExerciseDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
