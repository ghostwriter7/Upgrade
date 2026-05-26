import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHeader } from './session-header';
import { Router } from '@angular/router';
import { Mock } from 'vitest';
import { EditTime } from '../edit-time/edit-time';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { DateHelper } from '../../../common/helper/date.helper';
import { Session } from '../../../domain/model/session.model';
import { SessionStore } from '../../../store/session/session.store';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CommandBus } from '../../routers/command-bus';
import { PatchStartedAtCommand } from '../../commands/patch-started-at.command';
import { PatchFinishedAtCommand } from '../../commands/patch-finished-at.command';

describe('SessionHeader', () => {
  let fixture: ComponentFixture<SessionHeader>;
  let loader: ReturnType<typeof TestbedHarnessEnvironment.loader>;

  let sessionStore: { delete: Mock; };
  let router: { navigate: Mock };
  let dialogService: { open: Mock };
  let commandBus: { dispatch: Mock };
  let sessionStateHolder: { set: Mock };

  const startedAt = DateHelper.from('2026-05-17T12:00:00+02:00[Europe/Warsaw]');
  const finishedAt = DateHelper.from('2026-05-17T13:30:00+02:00[Europe/Warsaw]');
  let session: Session;

  const createSession = (finished = false): Session => {
    session = Session.createEmpty();
    session.startedAt = startedAt;

    if (finished) {
      session.finishedAt = finishedAt;
    }

    return session;
  };

  const createComponent = ({
    isNew = false,
    session = createSession(),
  }: {
    isNew?: boolean;
    session?: Session;
  } = {}): void => {
    fixture = TestBed.createComponent(SessionHeader);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('isNew', isNew);
    fixture.componentRef.setInput('session', session);
    fixture.detectChanges();
  };

  const clickMenuItemByText = async (test: string): Promise<void> => {
    const menu = await getMenu();
    await menu.open();

    const [item] = await menu.getItems({ text: new RegExp(test, 'i') });
    await item.click();
  };

  const getMenuItemTexts = async (): Promise<string[]> => {
    const menu = await getMenu();
    await menu.open();

    const items = await menu.getItems();
    return Promise.all(items.map((item) => item.getText()));
  };

  const getNativeElement = () => fixture.nativeElement as HTMLElement;

  const queryByTestId = (testId: string): HTMLElement | null =>
    getNativeElement().querySelector(`[data-testid=${testId}]`);

  const getMenu = async (): Promise<MatMenuHarness> => loader.getHarness(MatMenuHarness);

  const getStartedAtButton = () => queryByTestId(`session-header-started-at-${session.uuid}`);
  const getFinishedAtButton = () => queryByTestId(`session-header-finished-at-${session.uuid}`);
  const getFinishedAtValue = () =>
    queryByTestId(`session-header-finished-at-value-${session.uuid}`);
  const getDuration = () => queryByTestId(`session-header-duration-${session.uuid}`);

  beforeEach(() => {
    sessionStore = {
      delete: vi.fn(),
    };

    router = {
      navigate: vi.fn(),
    };

    dialogService = {
      open: vi.fn(),
    };

    sessionStateHolder = {
      set: vi.fn(),
    };

    commandBus = {
      dispatch: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [SessionHeader],
      providers: [
        { provide: SessionStore, useValue: sessionStore },
        { provide: Router, useValue: router },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        { provide: CommandBus, useValue: commandBus },
      ],
    });

    TestBed.overrideComponent(SessionHeader, {
      set: {
        providers: [{ provide: DialogService, useValue: dialogService }],
      },
    });
  });

  it('should render started time', () => {
    createComponent({
      session: createSession(false),
    });

    expect(queryByTestId(`session-header-started-at-value-${session.uuid}`)?.textContent).toEqual(
      '12:00',
    );
  });

  it('should not render finished time when session is unfinished', () => {
    createComponent({
      session: createSession(false),
    });

    expect(getFinishedAtValue()).toBeNull();
  });

  it('should not render duration when session is unfinished', () => {
    createComponent({
      session: createSession(false),
    });

    expect(getDuration()).toBeNull();
  });

  it('should render finished time when session is finished', () => {
    createComponent({
      session: createSession(true),
    });

    expect(getFinishedAtValue()?.textContent).toEqual('13:30');
  });

  it('should render duration when session is finished', () => {
    createComponent({
      session: createSession(true),
    });

    expect(getDuration()?.textContent).toEqual('1h 30m');
  });

  it('should render duration in minutes only when duration is less than one hour', () => {
    session = Session.createEmpty();
    session.startedAt = DateHelper.from('2026-05-17T12:00:00+02:00[Europe/Warsaw]');
    session.finishedAt = DateHelper.from('2026-05-17T12:45:00+02:00[Europe/Warsaw]');

    createComponent({ session });

    expect(getDuration()?.textContent).toEqual('45m');
  });

  it('should open edit started at dialog when started time is clicked', () => {
    session = createSession(false);
    createComponent({ session });

    getStartedAtButton()?.click();

    expect(dialogService.open).toHaveBeenCalledWith(EditTime, expect.any(Function), {
      data: {
        instant: session.startedAt,
        label: 'Edit Started At',
      },
    });
  });

  it('should dispatch PatchStartedAtCommand edit started at dialog result', () => {
    const changedStartedAt = Temporal.Instant.from('2026-05-17T09:30:00Z');

    createComponent({
      session: createSession(false),
    });

    getStartedAtButton()?.click();

    const [, callback] = dialogService.open.mock.calls.at(-1)!;
    callback(changedStartedAt);

    expect(commandBus.dispatch).toHaveBeenCalledWith(new PatchStartedAtCommand(changedStartedAt));
  });

  it('should open edit finished at dialog when finished time is clicked', () => {
    const session = createSession(true);
    createComponent({ session });

    getFinishedAtButton()?.click();

    expect(dialogService.open).toHaveBeenCalledWith(EditTime, expect.any(Function), {
      data: {
        instant: session.finishedAt,
        label: 'Edit Finished At',
      },
    });
  });

  it('should dispatch PatchFinishedAtCommand with edit finished at dialog result', () => {
    const changedFinishedAt = Temporal.Instant.from('2026-05-17T12:00:00Z');

    createComponent({
      session: createSession(true),
    });

    getFinishedAtButton()?.click();

    const [, callback] = dialogService.open.mock.calls.at(-1)!;
    callback(changedFinishedAt);

    expect(commandBus.dispatch).toHaveBeenCalledWith(new PatchFinishedAtCommand(changedFinishedAt));
  });

  it('should show Edit menu item when session is final', async () => {
    createComponent({
      session: createSession(true),
    });

    const itemTexts = await getMenuItemTexts();

    expect(itemTexts).toContain('edit Edit');
  });

  it('should not show Edit menu item when session is new', async () => {
    createComponent({
      isNew: true,
      session: createSession(false),
    });

    const itemTexts = await getMenuItemTexts();

    expect(itemTexts).not.toContain('edit Edit');
  });

  it('should set edited session when Edit menu item is clicked', async () => {
    const session = createSession(true);
    createComponent({ session });

    await clickMenuItemByText('Edit');

    expect(sessionStateHolder.set).toHaveBeenCalledExactlyOnceWith(session);
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/session/edit']);
  });

  it('should show Delete menu item', async () => {
    createComponent({
      session: createSession(false),
    });

    const itemTexts = await getMenuItemTexts();

    expect(itemTexts).toContain('delete_forever Delete');
  });

  it('should open confirm delete dialog when Delete menu item is clicked', async () => {
    createComponent({
      session: createSession(false),
    });

    await clickMenuItemByText('Delete');

    expect(dialogService.open).toHaveBeenCalledWith(ConfirmDeleteAlert, expect.any(Function));
  });

  it('should navigate home after confirming delete for a new session', async () => {
    createComponent({
      isNew: true,
      session: createSession(false),
    });

    await clickMenuItemByText('Delete');

    const [, callback] = dialogService.open.mock.calls.at(-1)!;
    callback();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(sessionStore.delete).not.toHaveBeenCalled();
  });

  it('should delete session after confirming delete for an existing session', async () => {
    const session = createSession(false);

    createComponent({
      isNew: false,
      session,
    });

    await clickMenuItemByText('Delete');

    const [, callback] = dialogService.open.mock.calls.at(-1)!;
    callback();

    expect(sessionStore.delete).toHaveBeenCalledWith(session);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
