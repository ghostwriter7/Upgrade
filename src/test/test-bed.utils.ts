import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Provider, Type } from '@angular/core';
import { DialogTestHostComponent } from './dialog-test-host';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';

export type OpenDialogFnResult = Promise<{ dialog: MatDialogHarness; result: Promise<unknown> }>;
export type OpenDialogFn = () => OpenDialogFnResult;

export class TestBedUtils {
  public static async configure(config: {
    providers?: Provider[];
    removeImports?: Type<unknown>[];
    addImports?: Type<unknown>[];
    targetComponent: Type<unknown>;
  }): Promise<{
    fixture: ComponentFixture<DialogTestHostComponent>;
    rootLoader: HarnessLoader;
    openDialog: (data: unknown) => OpenDialogFnResult;
  }> {
    TestBed.configureTestingModule({
      providers: config.providers ?? [],
      imports: [DialogTestHostComponent, config.targetComponent],
    });

    if (config.addImports || config.removeImports) {
      TestBed.overrideComponent(config.targetComponent, {
        remove: { imports: config.removeImports },
        add: { imports: config.addImports },
      });
    }

    await TestBed.compileComponents();

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
