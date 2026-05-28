import { UpsertSet } from './upsert-set.component';
import { OpenDialogFnResult, TestBedUtils } from '../../../../test/test-bed.utils';
import { UpsertSetDialogData } from './upsert-set-dialog-data.interface';
import { Component, input, signal } from '@angular/core';
import { SetForm } from '../set-form/set-form';
import { SetData } from '../set-form/set-data.interface';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { getButton } from '../../../../test/harness.utils';

const mockSetFormInvalid = signal(false);

@Component({
  selector: 'app-set-form',
  standalone: true,
  template: '',
})
class MockSetForm {
  public readonly value = input<unknown>();
  public readonly isInvalid = mockSetFormInvalid;
}

describe('UpsertSet', () => {
  let openDialog: (data: UpsertSetDialogData) => OpenDialogFnResult;

  beforeEach(async () => {
    const result = await TestBedUtils.configureForDialog({
      targetComponent: UpsertSet,
      removeImports: [SetForm],
      addImports: [MockSetForm],
    });

    openDialog = (data: UpsertSetDialogData) => result.openDialog(data);
  });

  afterEach(() => mockSetFormInvalid.set(false))

  const set: SetData = {
    reps: 10,
    duration: 0,
    weight: 80,
    type: 'weight',
  };

  const click = async (dialog: MatDialogHarness, text: string) => {
    const button = await getButton(dialog, text);
    return button.click();
  };

  it('should show default title and button text', async () => {
    const { dialog } = await openDialog({ set });

    await expect(dialog.getTitleText()).resolves.toBe('Edit Set');

    const saveButton = await getButton(dialog, 'Update');

    await expect(saveButton.getText()).resolves.toBe('Update');
  });

  it('should show custom title and button text', async () => {
    const { dialog } = await openDialog({
      set,
      label: 'Add Set',
      button: 'Save',
    });

    await expect(dialog.getTitleText()).resolves.toBe('Add Set');

    const saveButton = await getButton(dialog, 'Save');

    await expect(saveButton.getText()).resolves.toBe('Save');
  });

  it('should disable save button when form is invalid', async () => {
    mockSetFormInvalid.set(true);

    const { dialog } = await openDialog({ set });

    const saveButton = await getButton(dialog, 'Update');

    await expect(saveButton.isDisabled()).resolves.toBe(true);
  });

  it('should close with form value when save is clicked', async () => {
    const { dialog, result } = await openDialog({ set });

    await click(dialog, 'Update');

    await expect(result).resolves.toEqual(set);
  });

  it('should close without result when cancel is clicked', async () => {
    const { dialog, result } = await openDialog({ set });

    await click(dialog, 'Cancel');

    await expect(result).resolves.toBeNull();
  });
});
