import { expect, test } from '@playwright/test';
import { getExerciseUuid } from '../support/exercise.utils';
import { HomePage } from '../pages/home.page';
import { SessionPage } from '../pages/session.page';

test('Create Session', async ({ page }) => {
  const homePage = new HomePage(page);
  const sessionPage = new SessionPage(page);

  await homePage.goTo();
  await homePage.startSession();

  await expect(sessionPage.cancelButton).toBeHidden();

  await sessionPage.showExerciseSelector();
  await page.getByText('Chin Ups').click();
  await page.getByTestId('exercise-selector-add-btn').click();

  const chinUpUuid = getExerciseUuid('Chin Ups');
  await expect(sessionPage.completeButton).toBeDisabled();

  await page.getByTestId(`exercise-card-header-${chinUpUuid}`).click();
  await page.getByTestId(`exercise-card-show-set-form-btn-${chinUpUuid}`).click();
  await page.getByTestId(`set-form-reps-10`).click();
  await page.getByTestId('upsert-set-save-btn').click();

  await expect(sessionPage.completeButton).toBeEnabled();
  await sessionPage.completeSession();
  await expect(sessionPage.completeButton).toBeHidden();
});
