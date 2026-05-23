import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get todayCell(): Locator {
    return this.page.getByTestId(`session-calendar-cell-${new Date().getDate()}`);
  }

  public goTo(): Promise<Response | null> {
    return this.page.goto('/');
  }

  public startSession(): Promise<void> {
    return this.page.getByRole('button', { name: 'Start Session' }).click();
  }
}
