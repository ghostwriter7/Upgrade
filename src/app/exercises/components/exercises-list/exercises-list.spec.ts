import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesList } from './exercises-list';
import { signal, WritableSignal } from '@angular/core';
import { Exercise } from '@domain/model/exercise.model';
import { ExerciseStore } from '@store/exercises.store';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatActionListHarness } from '@angular/material/list/testing';

describe('ExercisesList', () => {
  let component: ExercisesList;
  let fixture: ComponentFixture<ExercisesList>;
  let loader: HarnessLoader;

  let exerciseStoreMock: { exercises: WritableSignal<Exercise[]> };

  beforeEach(async () => {
    exerciseStoreMock = {
      exercises: signal([
        new Exercise('chin-ups', 'Chin Ups'),
        new Exercise('pull-ups', 'Pull Ups'),
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [ExercisesList],
      providers: [{ provide: ExerciseStore, useValue: exerciseStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExercisesList);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should render a list of exercises', async () => {
    const harness = await loader.getHarness(MatActionListHarness);
    const items = await harness.getItems();

    expect(items).toHaveLength(2);
    const labels = await Promise.all(items.map((item) => item.getFullText()));
    expect(labels).toEqual(['Chin Ups', 'Pull Ups']);
  });

  it('should emit exerciseSelected event upon clicking on an exercise', async () => {
    const harness = await loader.getHarness(MatActionListHarness);
    const items = await harness.getItems({ fullText: 'Pull Ups' });

    component.exerciseSelected.subscribe((value) => expect(value).toEqual('pull-ups'));

    await items[0].click();

    expect(items).toHaveLength(1);
    expect.assertions(2);
  });
});
