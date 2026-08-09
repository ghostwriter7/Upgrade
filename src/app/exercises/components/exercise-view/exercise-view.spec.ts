import { ComponentFixture, TestBed } from '@angular/core/testing';

import ExerciseView from './exercise-view';
import { Mock } from 'vitest';
import { QueryBus } from '@common/routers/query/query-bus';

describe('ExerciseView', () => {
  let component: ExerciseView;
  let fixture: ComponentFixture<ExerciseView>;
  let queryBus: { execute: Mock };

  beforeEach(async () => {
    queryBus = { execute: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ExerciseView],
      providers: [
        { provide: QueryBus, useValue: queryBus }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseView);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'horse-stance-squat');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
