
import { Recorder } from './recorder';
import { OpenDialogFnResult, TestBedUtils } from '@test/test-bed.utils';

describe.skip('Recorder', () => {
  let openDialog: (data: unknown) => OpenDialogFnResult;

  beforeEach(async () => {
    const result = await TestBedUtils.configureForDialog({
      targetComponent: Recorder,
    });

    openDialog = result.openDialog;
  });

  it('should render a title', async () => {
    const { dialog } = await openDialog(undefined);

    await expect(dialog.getTitleText()).resolves.toBe('Record');
  });
});
