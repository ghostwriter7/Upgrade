import { Locator, Page, Response, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Temporal } from '@js-temporal/polyfill';

export class HomePage extends BasePage {
  public readonly calendar: Calendar;

  constructor(page: Page) {
    super(page);
    this.calendar = new Calendar(page);
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

class Calendar {
  private readonly today = Temporal.Now.plainDateISO();

  constructor(public readonly page: Page) {}

  public get todayCell(): Locator {
    return this.page.getByTestId(`session-calendar-cell-${this.today.day}`);
  }

  public clickToday(): Promise<void> {
    return this.todayCell.click();
  }
}
