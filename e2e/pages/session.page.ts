import { Locator, Page, expect } from '@playwright/test';
import { getExerciseUuid } from '../support/exercise.utils';
import { BasePage } from './base.page';

export class SessionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get sessionMenu(): Locator {
    return this.page.getByTestId('session-header-menu');
  }

  public get completeButton(): Locator {
    return this.page.getByRole('button', { name: 'Complete' });
  }

  public get cancelButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  public get addSkillButton(): Locator {
    return this.page.getByRole('button', { name: 'Skill' });
  }

  public showSkillSelector(): Promise<void> {
    return this.page.getByTestId('session-actions-add-exercise-btn').click();
  }

  public completeSession(): Promise<void> {
    return this.completeButton.click();
  }

  public async addSkill(name: string): Promise<void> {
    await this.showSkillSelector();
    const exerciseSelector = this.page.getByTestId('exercise-selector');
    await exerciseSelector.getByText(name, { exact: true }).click();
    await exerciseSelector.getByTestId('exercise-selector-add-btn').click();
  }

  public async showActionsForExercise(name: string): Promise<void> {
    await this.page.getByTestId(`exercise-card-header-${getExerciseUuid(name)}`).click();
  }

  public async showAddSetFormForExercise(name: string): Promise<void> {
    await this.showActionsForExercise(name);
    await this.page
      .getByTestId(`exercise-card-actions-show-set-form-btn-${getExerciseUuid(name)}`)
      .click();
  }

  public closeAddSetForm(): Promise<void> {
    return this.page.getByTestId('upsert-set-cancel-btn').click();
  }

  public async addIsoSet(duration: number, weight?: number): Promise<void> {
    await this.selectSetType('iso');
    await this.page.getByTestId(`set-form-duration-${duration}`).click();
    if (weight !== undefined) await this.page.getByTestId(`set-form-weight-${weight}`).click();
    await this.clickSaveSet();
  }

  public async addWeightSet(reps: number, weight: number): Promise<void> {
    await this.selectSetType('weight');
    await this.page.getByTestId(`set-form-reps-${reps}`).click();
    await this.page.getByTestId(`set-form-weight-${weight}`).click();
    await this.clickSaveSet();
  }

  public async addBodyweightSet(reps: number): Promise<void> {
    await this.selectSetType('bodyweight');
    await this.page.getByTestId(`set-form-reps-${reps}`).click();
    await this.clickSaveSet();
  }

  public selectSetType(type: 'bodyweight' | 'iso' | 'weight'): Promise<void> {
    return this.page.getByTestId(`set-form-type-${type}`).click();
  }

  public clickSaveSet(): Promise<void> {
    return this.page.getByTestId('upsert-set-save-btn').click();
  }

  public async deleteSession(): Promise<void> {
    await this.sessionMenu.click();
    await this.page.getByTestId('session-header-delete-menu-option').click();
    await this.page.getByTestId('confirm-delete-alert-yes-button').click();
    await expect(this.page.getByTestId('session-list-empty-message')).toBeVisible();
  }
}
