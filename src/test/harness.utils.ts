import { MatButtonHarness } from '@angular/material/button/testing';
import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';

type HarnessLoader = { getHarness<T extends ComponentHarness>(query: HarnessQuery<T>): Promise<T> };

export const getButton = (loader: HarnessLoader, text: string) =>
  loader.getHarness(MatButtonHarness.with({ text }));


export const getButtonByTestId = (
  loader: HarnessLoader,
  testId: string,
) => loader.getHarness(MatButtonHarness.with({ selector: `[data-testid="${testId}"]` }));
