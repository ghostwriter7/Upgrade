import { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {
  }

  public clickHomeLink(): Promise<void> {
    return this.page.getByTestId('toolbar-home-link').click();
  }
}
