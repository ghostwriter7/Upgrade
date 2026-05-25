import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionActions } from './session-actions';
import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { Mock } from 'vitest';
import { SessionEditorService } from '../services/session-editor.service';
import { Router } from '@angular/router';

describe('SessionActions', () => {
  let fixture: ComponentFixture<SessionActions>;
  let sessionEditor: {
    $isEditable: WritableSignal<boolean>;
    $isUnfinished: WritableSignal<boolean>;
    $isSessionInvalid: WritableSignal<boolean>;
    $session: Signal<{ isoDate: string }>;
    completeSession: Mock;
    cancelEdit: Mock;
    showExerciseDialog: Mock;
  };
  let router: {
    navigate: Mock;
  };

  const createComponent = (): void => {
    fixture = TestBed.createComponent(SessionActions);
    fixture.detectChanges();
  };

  const getButtons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));

  const getButtonByText = (text: string): HTMLButtonElement | undefined =>
    getButtons().find((button) => button.textContent?.includes(text));

  beforeEach(async () => {
    sessionEditor = {
      $isEditable: signal(true),
      $isUnfinished: signal(true),
      $isSessionInvalid: signal(false),
      $session: computed(() => ({ isoDate: '2026-05-17' })),
      completeSession: vi.fn(),
      cancelEdit: vi.fn(),
      showExerciseDialog: vi.fn(),
    };

    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SessionActions],
      providers: [
        { provide: SessionEditorService, useValue: sessionEditor },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  it('should not render actions when session is not editable', () => {
    sessionEditor.$isEditable.set(false);

    createComponent();

    expect(fixture.nativeElement.querySelector('.actions')).toBeNull();
    expect(getButtons()).toEqual([]);
  });

  it('should render Complete and Skill buttons when session is editable and unfinished', () => {
    sessionEditor.$isEditable.set(true);
    sessionEditor.$isUnfinished.set(true);
    sessionEditor.$isSessionInvalid.set(false);

    createComponent();

    expect(getButtonByText('Complete')).toBeDefined();
    expect(getButtonByText('Skill')).toBeDefined();
    expect(getButtonByText('Cancel')).toBeUndefined();
  });

  it('should disable Complete button when session is invalid', () => {
    sessionEditor.$isEditable.set(true);
    sessionEditor.$isUnfinished.set(true);
    sessionEditor.$isSessionInvalid.set(true);

    createComponent();

    expect(getButtonByText('Complete')?.disabled).toBe(true);
  });

  it('should enable Complete button when session is valid', () => {
    sessionEditor.$isEditable.set(true);
    sessionEditor.$isUnfinished.set(true);
    sessionEditor.$isSessionInvalid.set(false);

    createComponent();

    expect(getButtonByText('Complete')?.disabled).toBe(false);
  });

  it('should complete the session and navigate to the session date when Complete is clicked', () => {
    sessionEditor.$isEditable.set(true);
    sessionEditor.$isUnfinished.set(true);
    sessionEditor.$isSessionInvalid.set(false);

    createComponent();

    getButtonByText('Complete')?.click();

    expect(sessionEditor.completeSession).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(['/session', '2026-05-17']);
  });

  it('should not complete the session when disabled Complete button is clicked', () => {
    sessionEditor.$isEditable.set(true);
    sessionEditor.$isUnfinished.set(true);
    sessionEditor.$isSessionInvalid.set(true);

    createComponent();

    getButtonByText('Complete')?.click();

    expect(sessionEditor.completeSession).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should render Cancel and Skill buttons when session is editable and already finished', () => {
    sessionEditor.$isEditable.set(true);
    sessionEditor.$isUnfinished.set(false);

    createComponent();

    expect(getButtonByText('Cancel')).toBeDefined();
    expect(getButtonByText('Skill')).toBeDefined();
    expect(getButtonByText('Complete')).toBeUndefined();
  });

  it('should cancel edit when Cancel is clicked', () => {
    sessionEditor.$isEditable.set(true);
    sessionEditor.$isUnfinished.set(false);

    createComponent();

    getButtonByText('Cancel')?.click();

    expect(sessionEditor.cancelEdit).toHaveBeenCalledOnce();
  });

  it('should show exercise dialog when Skill is clicked', () => {
    sessionEditor.$isEditable.set(true);

    createComponent();

    getButtonByText('Skill')?.click();

    expect(sessionEditor.showExerciseDialog).toHaveBeenCalledOnce();
  });

  it('should update the rendered actions when editability changes', () => {
    createComponent();

    expect(getButtonByText('Complete')).toBeDefined();
    expect(getButtonByText('Skill')).toBeDefined();

    sessionEditor.$isEditable.set(false);
    fixture.detectChanges();

    expect(getButtons()).toEqual([]);
  });

  it('should update from Complete to Cancel when session becomes finished while editable', () => {
    createComponent();

    expect(getButtonByText('Complete')).toBeDefined();
    expect(getButtonByText('Cancel')).toBeUndefined();

    sessionEditor.$isUnfinished.set(false);
    fixture.detectChanges();

    expect(getButtonByText('Complete')).toBeUndefined();
    expect(getButtonByText('Cancel')).toBeDefined();
  });
});
