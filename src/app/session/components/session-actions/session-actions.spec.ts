import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionActions } from './session-actions';
import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { Mock } from 'vitest';
import { Router } from '@angular/router';
import { Session } from '../../../domain/model/session/session.model';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CommandBus } from '../../routers/command-bus';
import { CompleteSessionCommand } from '../../commands/complete-session/complete-session.command';
import { DialogService } from '../../../common/service/dialog/dialog.service';

describe('SessionActions', () => {
  let fixture: ComponentFixture<SessionActions>;

  let router: {
    navigate: Mock;
  };

  let commandBus: {
    dispatch: Mock;
  }

  let sessionStateHolder: {
    isUnfinished: WritableSignal<boolean>;
    isSessionInvalid: WritableSignal<boolean>;
    session: Signal<Pick<Session, 'isoDate'>>
  }

  let dialogService: { open: Mock; }

  const createComponent = (): void => {
    fixture = TestBed.createComponent(SessionActions);
    fixture.detectChanges();
  };

  const getButtons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));

  const getButtonByText = (text: string): HTMLButtonElement | undefined =>
    getButtons().find((button) => button.textContent?.includes(text));

  beforeEach(async () => {
    sessionStateHolder = {
      isUnfinished: signal(true),
      isSessionInvalid: signal(false),
      session: computed(() => ({ isoDate: '2026-05-17' })),
    }

    commandBus = {
      dispatch: vi.fn(),
    }

    router = {
      navigate: vi.fn(),
    };

    dialogService = {
      open: vi.fn(),
    }

    await TestBed.configureTestingModule({
      imports: [SessionActions],
      providers: [
        { provide: Router, useValue: router },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        { provide: CommandBus, useValue: commandBus },
        { provide: DialogService, useValue: dialogService }
      ],
    }).compileComponents();
  });

  it('should render Complete and Skill buttons when session is unfinished', () => {
    sessionStateHolder.isUnfinished.set(true);
    sessionStateHolder.isSessionInvalid.set(false);

    createComponent();

    expect(getButtonByText('Complete')).toBeDefined();
    expect(getButtonByText('Skill')).toBeDefined();
    expect(getButtonByText('Cancel')).toBeUndefined();
  });

  it('should disable Complete button when session is invalid', () => {
    sessionStateHolder.isUnfinished.set(true);
    sessionStateHolder.isSessionInvalid.set(true);

    createComponent();

    expect(getButtonByText('Complete')?.disabled).toBe(true);
  });

  it('should enable Complete button when session is valid', () => {
    sessionStateHolder.isUnfinished.set(true);
    sessionStateHolder.isSessionInvalid.set(false);

    createComponent();

    expect(getButtonByText('Complete')?.disabled).toBe(false);
  });

  it('should complete the session and navigate to the session date when Complete is clicked', () => {
    sessionStateHolder.isUnfinished.set(true);
    sessionStateHolder.isSessionInvalid.set(false);

    createComponent();

    getButtonByText('Complete')?.click();

    expect(commandBus.dispatch).toHaveBeenCalledExactlyOnceWith(new CompleteSessionCommand());
    expect(router.navigate).toHaveBeenCalledWith(['/session', '2026-05-17']);
  });

  it('should not complete the session when disabled Complete button is clicked', () => {
    sessionStateHolder.isUnfinished.set(true);
    sessionStateHolder.isSessionInvalid.set(true);

    createComponent();

    getButtonByText('Complete')?.click();

    expect(commandBus.dispatch).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should render Cancel and Skill buttons when session is already finished', () => {
    sessionStateHolder.isUnfinished.set(false);

    createComponent();

    expect(getButtonByText('Cancel')).toBeDefined();
    expect(getButtonByText('Skill')).toBeDefined();
    expect(getButtonByText('Complete')).toBeUndefined();
  });

  it('should cancel edit when Cancel is clicked', () => {
    sessionStateHolder.isUnfinished.set(false);

    createComponent();

    getButtonByText('Cancel')?.click();

    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/session', sessionStateHolder.session().isoDate]);
  });

  it('should show exercise dialog when Skill is clicked', () => {
    sessionStateHolder.isUnfinished.set(false);

    createComponent();

    getButtonByText('Skill')?.click();

    expect(dialogService.open).toHaveBeenCalledOnce();
  });

  it('should update from Complete to Cancel when session becomes finished', () => {
    createComponent();

    expect(getButtonByText('Complete')).toBeDefined();
    expect(getButtonByText('Cancel')).toBeUndefined();

    sessionStateHolder.isUnfinished.set(false);
    fixture.detectChanges();

    expect(getButtonByText('Complete')).toBeUndefined();
    expect(getButtonByText('Cancel')).toBeDefined();
  });
});
