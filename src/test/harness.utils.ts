import { MatButtonHarness } from '@angular/material/button/testing';
import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';

type HarnessLoader = { getHarness<T extends ComponentHarness>(query: HarnessQuery<T>): Promise<T> };

export const getButton = (loader: HarnessLoader, text: string) =>
  loader.getHarness(MatButtonHarness.with({ text }));

export const getButtonToggle = (loader: HarnessLoader, text: string) =>
  loader.getHarness(MatButtonToggleHarness.with({ text }));

export const getButtonByTestId = (
  loader: HarnessLoader,
  testId: string,
) => loader.getHarness(MatButtonHarness.with({ selector: `[data-testid="${testId}"]` }));
