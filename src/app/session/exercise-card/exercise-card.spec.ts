import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCard } from './exercise-card';

describe('ExerciseCard', () => {
  let component: ExerciseCard;
  let fixture: ComponentFixture<ExerciseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
