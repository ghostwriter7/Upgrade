import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesList } from './exercises-list';

describe('ExercisesList', () => {
  let component: ExercisesList;
  let fixture: ComponentFixture<ExercisesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesList],
    }).compileComponents();

    fixture = TestBed.createComponent(ExercisesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
