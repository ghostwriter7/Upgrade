import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDropdown } from './exercise-dropdown';
import { createExerciseStoreMock, ExerciseStoreMock } from '@test/mocks/exercise-store.mock';
import { ExerciseStore } from '@store/exercises.store';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';

describe('ExerciseDropdown', () => {
  let component: ExerciseDropdown;
  let fixture: ComponentFixture<ExerciseDropdown>;
  let loader: HarnessLoader;
  let exerciseStoreMock: ExerciseStoreMock;

  beforeEach(async () => {
    exerciseStoreMock = createExerciseStoreMock();

    await TestBed.configureTestingModule({
      imports: [ExerciseDropdown],
      providers: [{ provide: ExerciseStore, useValue: exerciseStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseDropdown);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const getHarness = () => loader.getHarness(MatAutocompleteHarness);

  it('should create', () => expect(component).toBeTruthy());

  it('should render all available options by default (no user input)', async () => {
    const expectedOptions = exerciseStoreMock.exercises().map(({ name }) => name);

    const harness = await getHarness();
    await harness.focus();
    const options = await harness.getOptions();
    const actualLabels = await Promise.all(options.map((option) => option.getText()));

    expect(actualLabels).toEqual(expectedOptions);
  });

  it('should emit exerciseSelected event upon clicking on an option', async () => {
    component.exerciseSelected.subscribe((exerciseId) => expect(exerciseId).toEqual('side-split'));

    const harness = await getHarness();
    await harness.focus();
    const options = await harness.getOptions({ text: 'Side Split' });
    await options[0].click();

    expect(options).toHaveLength(1);
    expect.assertions(2);
  });

  test.each([
    { input: 'Ups', expected: ['Chin Ups', 'Pull Ups'] },
    { input: 'l', expected: ['L-Sit', 'Pull Ups', 'Side Split'] },
  ])('should display options matching user`s filter', async ({ input, expected }) => {
    const harness = await getHarness();
    await harness.enterText(input);

    const options = await harness.getOptions();
    const actualLabels = await Promise.all(options.map((option) => option.getText()));

    expect(actualLabels).toEqual(expected);
    expect(actualLabels).toHaveLength(expected.length);
  });
});
