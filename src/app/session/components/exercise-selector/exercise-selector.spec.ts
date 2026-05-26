import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { ExerciseSelector } from './exercise-selector';
import { Exercise } from '../../../domain/model/exercise.model';
import { ExerciseStore } from '../../../store/exercises.store';
import { Session } from '../../../domain/model/session.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListOptionHarness, MatSelectionListHarness } from '@angular/material/list/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { DialogTestHostComponent } from '../../../../test/dialog-test-host';

const chinUpId = 'aaa';
const squatsId = 'bbb';
const frontSplitId = 'ccc';

describe('ExerciseSelector', () => {
  let fixture: ComponentFixture<DialogTestHostComponent>;
  let rootLoader: HarnessLoader;

  const session = Session.createEmpty().addExercise(chinUpId);

  const openDialog = async (): Promise<{ dialog: MatDialogHarness; result: Promise<unknown> }> => {
    const result = fixture.componentInstance.openDialog(ExerciseSelector, { data: { session } });
    fixture.detectChanges();

    return { dialog: await rootLoader.getHarness(MatDialogHarness), result };
  };

  const getOptionTexts = async (options: MatListOptionHarness[]): Promise<string[]> =>
    Promise.all(options.map((option) => option.getFullText()));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ExerciseStore,
          useValue: {
            exercises: signal<Exercise[]>([
              new Exercise(chinUpId, 'Chin Ups'),
              new Exercise(squatsId, 'Squats'),
              new Exercise(frontSplitId, 'Front Split'),
            ]),
          },
        },
      ],
      imports: [DialogTestHostComponent, ExerciseSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogTestHostComponent);
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    await fixture.whenStable();
  });

  it('should open the exercise selector dialog', async () => {
    const { dialog } = await openDialog();

    const title = await dialog.getTitleText();

    expect(title).toBe('Exercises');
  });

  it('should only show exercises that are not already active in the session', async () => {
    const { dialog } = await openDialog();

    const selectionList = await dialog.getHarness(MatSelectionListHarness);
    const options = await selectionList.getItems();
    const optionTexts = await getOptionTexts(options);

    expect(optionTexts).toEqual(['Squats', 'Front Split']);
  });

  it('should disable the Add button while no exercise is selected', async () => {
    const { dialog } = await openDialog();

    const addButton = await dialog.getHarness(
      MatButtonHarness.with({
        text: 'Add',
      }),
    );
    const isDisabled = await addButton.isDisabled();

    expect(isDisabled).toBe(true);
  });

  it('should enable the Add button when an exercise is selected', async () => {
    const { dialog } = await openDialog();

    const selectionList = await dialog.getHarness(MatSelectionListHarness);
    const options = await selectionList.getItems();
    await options[0].select();

    const addButton = await dialog.getHarness(
      MatButtonHarness.with({
        text: 'Add',
      }),
    );
    const isDisabled = await addButton.isDisabled();

    expect(isDisabled).toBe(false);
  });

  it('should close with the selected exercise ids when Add is clicked', async () => {
    const { dialog, result } = await openDialog();

    const selectionList = await dialog.getHarness(MatSelectionListHarness);
    const options = await selectionList.getItems();

    await options[0].select();
    await options[1].select();

    const addButton = await dialog.getHarness(
      MatButtonHarness.with({
        text: 'Add',
      }),
    );
    await addButton.click();

    expect(await result).toEqual([squatsId, frontSplitId]);
  });

  it('should close without a result when Cancel is clicked', async () => {
    const { dialog, result } = await openDialog();

    const cancelButton = await dialog.getHarness(
      MatButtonHarness.with({
        text: 'Cancel',
      }),
    );
    await cancelButton.click();

    expect(await result).toBe('');
  });
});
