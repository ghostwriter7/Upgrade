import { Page } from '@playwright/test';

export class SessionPage {
  constructor(private readonly page: Page) {}

  public get completeButton() {
    return this.page.getByRole('button', { name: 'Complete' });
  }

  public get cancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  public showExerciseSelector() {
    return this.page.getByTestId('session-actions-add-exercise-btn').click();
  }

  public completeSession() {
    return this.completeButton.click();
  }
}
