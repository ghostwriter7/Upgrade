import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SessionPage } from '../pages/session.page';

test('should create a session with one exercise set', async ({ page }) => {
  const homePage = new HomePage(page);
  const sessionPage = new SessionPage(page);

  await test.step('Start Session', async () => {
    await homePage.goTo();
    await homePage.startSession();

    await expect(sessionPage.completeButton).toBeDisabled();
    await expect(sessionPage.cancelButton).toBeHidden();
    await expect(sessionPage.addSkillButton).toBeEnabled();
  });

  await test.step('Add exercise and set', async () => {
    const exerciseName = 'Chin Ups';
    await sessionPage.addSkill(exerciseName);

    await expect(sessionPage.completeButton).toBeDisabled();

    await sessionPage.showAddSetFormForExercise(exerciseName);
    await sessionPage.addBodyweightSet(10);

    await expect(sessionPage.completeButton).toBeEnabled();
  });

  await test.step('Complete session', async () => {
    await sessionPage.completeSession();

    await expect(sessionPage.completeButton).toBeHidden();
    await expect(sessionPage.addSkillButton).toBeHidden();
  });

  await test.step('Verify session appears on calendar', async () => {
    await sessionPage.clickHomeLink();
    await expect(page).toHaveURL('/');
    await expect(homePage.todayCell).toContainClass('calendar__cell--has-session');
  });
});
