import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Provider, Type } from '@angular/core';
import { DialogTestHostComponent } from './dialog-test-host';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';

export class TestBedUtils {
  public static async configure(config: {
    providers: Provider[];
    targetComponent: Type<unknown>;
  }): Promise<{
    fixture: ComponentFixture<DialogTestHostComponent>;
    rootLoader: HarnessLoader;
    openDialog: (data: unknown) => Promise<{ dialog: MatDialogHarness; result: Promise<unknown> }>;
  }> {
    await TestBed.configureTestingModule({
      providers: config.providers,
      imports: [DialogTestHostComponent, config.targetComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(DialogTestHostComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    await fixture.whenStable();

    return {
      fixture,
      rootLoader,
      openDialog: async (
        data: unknown,
      ): Promise<{ dialog: MatDialogHarness; result: Promise<unknown> }> => {
        const result = fixture.componentInstance.openDialog(config.targetComponent, { data });
        fixture.detectChanges();

        return { dialog: await rootLoader.getHarness(MatDialogHarness), result };
      },
    };
  }
}
