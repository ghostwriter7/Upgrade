import { ComponentFixture, TestBed } from '@angular/core/testing';

import SessionEditor from './session-editor';
import { SessionHeaderMock } from '../../../../test/mocks/session-header.mock';
import { ExerciseCardMock } from '../../../../test/mocks/exercise-card.mock';
import { SessionHeader } from '../session-header/session-header';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { Component, signal, WritableSignal } from '@angular/core';
import { SessionActions } from '../session-actions/session-actions';
import { TimerMock } from '../../../home/home-page/home-page.spec';
import { Timer } from '../timer/timer';
import { Mock } from 'vitest';
import { Session } from '../../../domain/model/session.model';
import { SessionStore } from '../../../store/session/session.store';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CommandBus } from '../../routers/command-bus';
import { CreateSessionCommand } from '../../commands/create-session/create-session-command';

@Component({
  selector: 'app-session-actions',
  template: '<p>Actions</p>',
})
export class SessionActionsMock {}

describe('SessionEditor', () => {
  let component: SessionEditor;
  let fixture: ComponentFixture<SessionEditor>;
  let sessionStoreMock: { updateCache: Mock };
  let commandBus: { dispatch: Mock };
  let sessionStateHolderMock: { session: WritableSignal<Session | null>; set: Mock };

  beforeEach(async () => {
    const sessionSignal = signal<Session | null>(null);
    sessionStoreMock = { updateCache: vi.fn() };
    sessionStateHolderMock = {
      session: sessionSignal,
      set: vi.fn().mockImplementation((session) => sessionSignal.set(session)),
    };
    commandBus = { dispatch: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [SessionEditor],
      providers: [
        { provide: SessionStore, useValue: sessionStoreMock },
        { provide: SessionStateHolder, useValue: sessionStateHolderMock },
        { provide: CommandBus, useValue: commandBus },
      ],
    })
      .overrideComponent(SessionEditor, {
        add: { imports: [SessionHeaderMock, ExerciseCardMock, SessionActionsMock, TimerMock] },
        remove: { imports: [SessionHeader, ExerciseCard, SessionActions, Timer] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SessionEditor);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a CreateSessionCommand when running in a new mode', () => {
    fixture.componentRef.setInput('isNew', true);
    fixture.detectChanges();

    expect(commandBus.dispatch).toHaveBeenCalledExactlyOnceWith(new CreateSessionCommand());
  });

  it('should not create a new session when running in an edit mode', () => {
    fixture.componentRef.setInput('isNew', false);
    sessionStateHolderMock.session.set(Session.createEmpty().addExercise('any exercise'));
    fixture.detectChanges();

    expect(commandBus.dispatch).not.toHaveBeenCalled();
  });
});
