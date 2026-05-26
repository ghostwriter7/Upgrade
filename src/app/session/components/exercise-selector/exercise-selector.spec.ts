import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { ExerciseSelector } from './exercise-selector';
import { Exercise } from '../../../domain/model/exercise.model';
import { ExerciseStore } from '../../../store/exercises.store';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Session } from '../../../domain/model/session.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListOptionHarness, MatSelectionListHarness } from '@angular/material/list/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { firstValueFrom } from 'rxjs';

const chinUpId = 'aaa';
const squatsId = 'bbb';
const frontSplitId = 'ccc';

@Component({
  standalone: true,
  imports: [MatButton, MatDialogModule],
  template: `<button matButton type="button" (click)="openDialog()">Open</button>`,
})
class TestHostComponent {
  private readonly dialog = inject(MatDialog);

  readonly session = Session.createEmpty().addExercise(chinUpId);

  dialogResult: string[] | undefined;
  dialogClosed: Promise<unknown> | undefined;

  public openDialog(): void {
    const dialogRef = this.dialog.open<ExerciseSelector, { session: Session }, string[]>(
      ExerciseSelector,
      {
        data: {
          session: this.session,
        },
      },
    );

    this.dialogClosed = firstValueFrom(dialogRef.afterClosed());

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogResult = result;
    });
  }
}

describe('ExerciseSelector', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let rootLoader: HarnessLoader;
  let exerciseStore: { exercises: WritableSignal<Exercise[]> };

  const openDialog = async (): Promise<MatDialogHarness> => {
    fixture.componentInstance.openDialog();
    fixture.detectChanges();

    return rootLoader.getHarness(MatDialogHarness);
  };

  const getOptionTexts = async (options: MatListOptionHarness[]): Promise<string[]> =>
    Promise.all(options.map((option) => option.getFullText()));

  beforeEach(async () => {
    exerciseStore = {
      exercises: signal<Exercise[]>([
        new Exercise(chinUpId, 'Chin Ups'),
        new Exercise(squatsId, 'Squats'),
        new Exercise(frontSplitId, 'Front Split'),
      ]),
    };

    await TestBed.configureTestingModule({
      providers: [{ provide: ExerciseStore, useValue: exerciseStore }],
      imports: [TestHostComponent, ExerciseSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    await fixture.whenStable();
  });

  it('should open the exercise selector dialog', async () => {
    const dialog = await openDialog();

    const title = await dialog.getTitleText();

    expect(title).toBe('Exercises');
  });

  it('should only show exercises that are not already active in the session', async () => {
    const dialog = await openDialog();

    const selectionList = await dialog.getHarness(MatSelectionListHarness);
    const options = await selectionList.getItems();
    const optionTexts = await getOptionTexts(options);

    expect(optionTexts).toEqual(['Squats', 'Front Split']);
  });

  it('should disable the Add button while no exercise is selected', async () => {
    const dialog = await openDialog();

    const addButton = await dialog.getHarness(
      MatButtonHarness.with({
        text: 'Add',
      }),
    );
    const isDisabled = await addButton.isDisabled();

    expect(isDisabled).toBe(true);
  });

  it('should enable the Add button when an exercise is selected', async () => {
    const dialog = await openDialog();

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
    const dialog = await openDialog();

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
    await (component.dialogClosed as Promise<unknown>);

    expect(fixture.componentInstance.dialogResult).toEqual([squatsId, frontSplitId]);
  });

  it('should close without a result when Cancel is clicked', async () => {
    const dialog = await openDialog();

    const cancelButton = await dialog.getHarness(
      MatButtonHarness.with({
        text: 'Cancel',
      }),
    );
    await cancelButton.click();
    await (component.dialogClosed as Promise<unknown>);

    expect(fixture.componentInstance.dialogResult).toBe('');
  });
});
