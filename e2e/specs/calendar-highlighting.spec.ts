import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SessionPage } from '../pages/session.page';

test('should remove current day highlight after deleting the session', async ({ page }) => {
  const homePage = new HomePage(page);
  const sessionPage = new SessionPage(page);

  await test.step('Create cession', async () => {
    await homePage.goTo();
    await homePage.startSession();
    await sessionPage.addSkill('Chin Ups');
    await sessionPage.showAddSetFormForExercise('Chin Ups')
    await sessionPage.addBodyweightSet(10);
    await sessionPage.completeSession();
  });

  await test.step('Verify current day is highlight', async () => {
    await sessionPage.clickHomeLink();
    await expect(homePage.calendar.todayCell).toContainClass('highlight');
  });

  await test.step('Delete session', async () => {
    await homePage.calendar.clickToday();
    await sessionPage.deleteSession();
  });

  await test.step('Verify current day is not highlighted', async () => {
    await sessionPage.clickHomeLink();
    await expect(homePage.calendar.todayCell).not.toContainClass('highlight');
  });
});
