import { Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goTo() {
    await this.page.goto('/');
  }

  async startSession() {
    await this.page.getByRole('button', { name: 'Start Session' }).click();
  }
}
