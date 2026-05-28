import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Provider, Type } from '@angular/core';
import { DialogTestHostComponent } from './hosts/dialog-test-host';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { BottomSheetTestHost } from './hosts/bottom-sheet-test-host';
import { MatBottomSheetHarness } from '@angular/material/bottom-sheet/testing';

export type OpenDialogFnResult = Promise<{ dialog: MatDialogHarness; result: Promise<unknown> }>;
export type OpenDialogFn = () => OpenDialogFnResult;

export class TestBedUtils {
  public static async configureForDialog(config: {
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

    TestBedUtils.overrideComponents(
      config.targetComponent,
      config.addImports,
      config.removeImports,
    );

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

  public static async configureForBottomSheet(config: {
    providers?: Provider[];
    removeImports?: Type<unknown>[];
    addImports?: Type<unknown>[];
    targetComponent: Type<unknown>;
  }): Promise<{
    fixture: ComponentFixture<BottomSheetTestHost>;
    rootLoader: HarnessLoader;
    openSheet: (data: unknown) => void;
  }> {
    TestBed.configureTestingModule({
      providers: config.providers ?? [],
      imports: [BottomSheetTestHost, config.targetComponent],
    });

    TestBedUtils.overrideComponents(
      config.targetComponent,
      config.addImports,
      config.removeImports,
    );

    await TestBed.compileComponents();

    const fixture = TestBed.createComponent(BottomSheetTestHost);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    await fixture.whenStable();

    return {
      fixture,
      rootLoader,
      openSheet: async (data: unknown): Promise<{ sheet: MatBottomSheetHarness }> => {
        fixture.componentInstance.openSheet(config.targetComponent, { data });
        fixture.detectChanges();

        return { sheet: await rootLoader.getHarness(MatBottomSheetHarness) };
      },
    };
  }

  private static overrideComponents(
    targetComponent: Type<unknown>,
    addImports: Type<unknown>[] = [],
    removeImports: Type<unknown>[] = [],
  ): void {
    TestBed.overrideComponent(targetComponent, {
      remove: { imports: removeImports },
      add: { imports: addImports },
    });
  }
}
