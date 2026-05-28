import { EditNote } from './edit-note';
import { OpenDialogFnResult, TestBedUtils } from '../../../../test/test-bed.utils';
import { getButton } from '../../../../test/harness.utils';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';

describe('EditNote', () => {
  let openDialog: (note: string) => OpenDialogFnResult;

  beforeEach(async () => {
    const result = await TestBedUtils.configureForDialog({
      targetComponent: EditNote,
    });

    openDialog = (note: string) => result.openDialog({ note });
  });

  const getInput = (dialog: HarnessLoader) => dialog.getHarness(MatInputHarness);


  it('should open dialog with a provided note', async () => {
    const { dialog } = await openDialog('Test Note');

    await expect(getButton(dialog, 'Save')).resolves.toBeDefined();
    await expect(getButton(dialog, 'Cancel')).resolves.toBeDefined();
    await expect(dialog.getTitleText()).resolves.toBe('Notes');
    const input = await getInput(dialog);
    await expect(input.getValue()).resolves.toBe('Test Note');
  });

  it('should close the dialog with null result upon clicking on Cancel button', async () => {
    const { dialog, result } = await openDialog('Test Note');

    const cancel = await getButton(dialog, 'Cancel');
    await cancel.click();

    await expect(result).resolves.toBeNull();
  });

  it('should close the dialog with the updated note', async () => {
    const { dialog, result } = await openDialog('Test Note');

    const input = await getInput(dialog);
    await input.setValue('Updated Note');

    const save = await getButton(dialog, 'Save');
    await save.click();

    await expect(result).resolves.toBe('Updated Note');
  });
});
