import { ComponentFixture, TestBed } from '@angular/core/testing';

import ExercisesPage from './exercises-page';
import { ExercisesList } from '../exercises-list/exercises-list';
import { Component, output } from '@angular/core';
import { ExerciseDropdown } from '../exercise-dropdown/exercise-dropdown';
import { provideRouter } from '@angular/router';

@Component({ selector: 'app-exercises-list', template: '<div>Exercises List</div>' })
class ExercisesListMock {
  public exerciseSelected = output<string>();
}

@Component({ selector: 'app-exercise-dropdown', template: '<div>Exercise Dropdown</div>' })
class ExerciseDropdownMock {
  public exerciseSelected = output<string>();
}

describe('ExercisesPage', () => {
  let component: ExercisesPage;
  let fixture: ComponentFixture<ExercisesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesPage],
      providers: [provideRouter([])],
    })
      .overrideComponent(ExercisesPage, {
        remove: { imports: [ExercisesList, ExerciseDropdown] },
        add: { imports: [ExercisesListMock, ExerciseDropdownMock] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExercisesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => expect(component).toBeTruthy());
});
