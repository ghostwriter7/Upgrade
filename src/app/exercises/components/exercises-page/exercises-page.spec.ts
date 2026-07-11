import { ComponentFixture, TestBed } from '@angular/core/testing';

import ExercisesPage from './exercises-page';
import { ExercisesList } from '../exercises-list/exercises-list';
import { Component } from '@angular/core';

@Component({ selector: 'app-exercises-list', template: '<div>Exercises...</div>' })
class ExercisesListMock {}

describe('ExercisesPage', () => {
  let component: ExercisesPage;
  let fixture: ComponentFixture<ExercisesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesPage],
    })
      .overrideComponent(ExercisesPage, {
        remove: { imports: [ExercisesList] },
        add: { imports: [ExercisesListMock] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExercisesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
