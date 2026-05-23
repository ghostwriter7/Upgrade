import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SessionPage } from '../pages/session.page';

test('should create a session with a single exercise & set', async ({ page }) => {
  const homePage = new HomePage(page);
  const sessionPage = new SessionPage(page);

  await homePage.goTo();
  await homePage.startSession();

  await expect(sessionPage.completeButton).toBeDisabled();
  await expect(sessionPage.cancelButton).toBeHidden();
  await expect(sessionPage.addSkillButton).toBeEnabled();

  const exerciseName = 'Chin Ups';
  await sessionPage.addSkill(exerciseName);

  await expect(sessionPage.completeButton).toBeDisabled();

  await sessionPage.showAddSetFormForExercise(exerciseName);
  await sessionPage.addBodyweightSet(10);

  await expect(sessionPage.completeButton).toBeEnabled();
  await sessionPage.completeSession();

  await expect(sessionPage.completeButton).toBeHidden();
  await expect(sessionPage.addSkillButton).toBeHidden();

  await sessionPage.clickHomeLink();
  await expect(page).toHaveURL('/');
  await expect(homePage.todayCell).toContainClass('calendar__cell--has-session');
});
