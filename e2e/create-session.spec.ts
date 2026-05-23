import { expect, test } from '@playwright/test';
import { getExerciseUuid } from './exercise.utils';

test('Create Session', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Start Session' }).click();

  await expect(page.getByRole('button', { name: 'Cancel' })).toBeHidden();

  await page.getByTestId('session-actions-add-exercise-btn').click();
  await page.getByText('Chin Ups').click();
  await page.getByTestId('exercise-selector-add-btn').click();

  const chinUpUuid = getExerciseUuid('Chin Ups');
  await expect(page.getByTestId('session-actions-complete-btn')).toBeDisabled();

  await page.getByTestId(`exercise-card-header-${chinUpUuid}`).click();
  await page.getByTestId(`exercise-card-show-set-form-btn-${chinUpUuid}`).click();
  await page.getByTestId(`set-form-reps-10`).click();
  await page.getByTestId('upsert-set-save-btn').click();

  await expect(page.getByTestId('session-actions-complete-btn')).toBeEnabled();
  await page.getByTestId('session-actions-complete-btn').click();
  await expect(page.getByTestId('session-actions-complete-btn')).toBeHidden();
});
