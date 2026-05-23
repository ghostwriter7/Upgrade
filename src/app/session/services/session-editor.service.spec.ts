import { TestBed } from '@angular/core/testing';
import { describe, it, vi, beforeEach, Mock } from 'vitest';

import { SessionEditorService } from './session-editor.service';
import { SessionStore } from '../../store/session/session.store';
import { DialogService } from '../../common/service/dialog/dialog.service';
import { BodyweightSet, ExerciseSet } from '../../domain/model/exercise-set.model';
import { ExerciseLog, Session } from '../../domain/model/session.model';
import { SESSION } from '../consts/session.token';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { EditNote } from '../edit-note/edit-note';
import { ExerciseSelector } from '../exercise-selector/exercise-selector';
import { MediaRepository } from '../../persistence/repository/media.repository';

describe('SessionEditor', () => {
  let service: SessionEditorService;
  let sessionStore: { save: Mock };
  let dialogService: { open: Mock };
  let mediaRepository: { deleteMedia: Mock; save: Mock };

  const mockExerciseExists = (exerciseId: string): void => {
    service['sessionDraft'].update((s) => s.addExercise(exerciseId));
  };

  const addSet = (exerciseId: string, set: ExerciseSet): void => {
    service['sessionDraft'].update((session) => session.addSet(exerciseId, set));
  };

  const configureTestingModule = (session: Session = Session.createEmpty()): void => {
    sessionStore = { save: vi.fn() };
    dialogService = { open: vi.fn() };
    mediaRepository = { deleteMedia: vi.fn(), save: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: SessionStore, useValue: sessionStore },
        { provide: DialogService, useValue: dialogService },
        { provide: MediaRepository, useValue: mediaRepository },
        SessionEditorService,
        { provide: SESSION, useValue: session },
      ],
    });

    service = TestBed.inject(SessionEditorService);
  };

  describe('New Session', () => {
    beforeEach(() => {
      configureTestingModule();
      vi.useFakeTimers();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
      vi.useRealTimers();
    });

    it('$isEditable should return true when the session is new', () =>
      expect(service.$isEditable()).toBe(true));

    it('$session should represent the current session draft', () => {
      const session = service.$session();

      expect(session).toBeDefined();
      expect(session.startedAt).toBeInstanceOf(Temporal.Instant);
      expect(session.finishedAt).toBeNull();
      expect(session.uuid).toBeDefined();
    });

    describe('$isSessionInvalid', () => {
      it('should return true when the session draft has no working sets', () =>
        expect(service.$isSessionInvalid()).toBe(true));

      it('should return false when the session draft has working sets', () => {
        const exerciseId = 'exerciseId';
        mockExerciseExists(exerciseId);
        addSet(exerciseId, new BodyweightSet(10, null, null, null));

        expect(service.$isSessionInvalid()).toBe(false);
      });
    });

    it('$isUnfinished should return true for the new session as it has not yet been completed', () =>
      expect(service.$isUnfinished()).toBe(true));

    it('should add a set to an exercise', () => {
      mockExerciseExists('A');
      mockExerciseExists('B');
      const expectedSet = new BodyweightSet(10, null, null, null);

      service.displaySetForm('B');
      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback(expectedSet);

      expect(dialogService.open).toHaveBeenCalledWith(UpsertSet, expect.any(Function), {
        data: { set: new BodyweightSet(1, null, null, null), label: 'Add Set', button: 'Save' },
      });
      expect(service.$session().exercises).toEqual([
        new ExerciseLog('A'),
        new ExerciseLog('B').withSet(expectedSet),
      ]);
    });

    it('should delete a set from an exercise', () => {
      mockExerciseExists('A');
      const set = new BodyweightSet(10, null, null, null);
      addSet('A', set);

      service.deleteSet('A', 0);

      expect(service.$session().exercises).toEqual([new ExerciseLog('A')]);
    });

    it('should edit a set through the edit set dialog result callback', () => {
      const originalSet = new BodyweightSet(10, null, null, null);
      const editedSet = new BodyweightSet(20, null, null, null);
      mockExerciseExists('A');
      addSet('A', originalSet);

      service.editSet('A', originalSet, 0);

      expect(dialogService.open).toHaveBeenCalledWith(UpsertSet, expect.any(Function), {
        data: { set: originalSet },
      });

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback(editedSet);

      expect(service.$session().exercises).toEqual([new ExerciseLog('A').withSet(editedSet)]);
    });

    it('should complete the session, save it immediately and make it non-editable', () => {
      mockExerciseExists('A');
      addSet('A', new BodyweightSet(10, null, null, null));

      service.completeSession();

      expect(service.$session().finishedAt).toBeInstanceOf(Temporal.Instant);
      expect(service.$isUnfinished()).toBe(false);
      expect(service.$isEditable()).toBe(false);
      expect(sessionStore.save).toHaveBeenCalledWith(service.$session());
    });

    it('should patch startedAt', () => {
      const startedAt = Temporal.Instant.from('2025-01-01T10:00:00Z');

      service.patchStartedAt(startedAt);

      expect(service.$session().startedAt).toBe(startedAt);
    });

    it('should patch finishedAt', () => {
      const finishedAt = Temporal.Instant.from('2025-01-01T11:00:00Z');

      service.patchFinishedAt(finishedAt);

      expect(service.$session().finishedAt).toBe(finishedAt);
      expect(service.$isUnfinished()).toBe(false);
    });

    it('should delete an exercise through the confirm delete dialog callback', () => {
      mockExerciseExists('A');
      mockExerciseExists('B');
      const entry = service.$session().exercises[0];

      service.deleteExercise(entry);

      expect(dialogService.open).toHaveBeenCalledWith(ConfirmDeleteAlert, expect.any(Function));

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback();

      expect(service.$session().exercises).toEqual([new ExerciseLog('B')]);
    });

    it('should edit exercise notes through the edit note dialog result callback', () => {
      mockExerciseExists('A');
      const entry = service.$session().exercises[0];

      service.editExerciseNote(entry);

      expect(dialogService.open).toHaveBeenCalledWith(
        EditNote,
        expect.any(Function),
        {
          data: { note: entry.notes },
          width: '90svw',
          height: '90svh',
        },
        expect.any(Function),
      );

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback('Updated note');

      expect(service.$session().exercises[0].notes).toBe('Updated note');
    });

    it('should only accept string values from the edit note dialog', () => {
      mockExerciseExists('A');
      const entry = service.$session().exercises[0];

      service.editExerciseNote(entry);

      const [, , , predicate] = dialogService.open.mock.calls.at(-1)!;

      expect(predicate('')).toBe(true);
      expect(predicate('Note')).toBe(true);
      expect(predicate(undefined)).toBe(false);
      expect(predicate(null)).toBe(false);
    });

    it('should open exercise selector with the current session and add selected exercises', () => {
      service.showExerciseDialog();

      expect(dialogService.open).toHaveBeenCalledWith(ExerciseSelector, expect.any(Function), {
        data: { session: service.$session() },
        width: '90svw',
        height: '80svh',
      });

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback(new Set(['A', 'B']));

      expect(service.$session().exercises).toEqual([new ExerciseLog('A'), new ExerciseLog('B')]);
    });

    it('should not add exercises when exercise selector returns an empty set', () => {
      service.showExerciseDialog();

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback(new Set<string>());

      expect(service.$session().exercises).toEqual([]);
    });

    it('should make the session editable', () => {
      service.makeEditable();

      expect(service.$isEditable()).toBe(true);
    });

    it('should auto-save non-empty session draft changes after debounce', async () => {
      mockExerciseExists('A');
      TestBed.tick();
      addSet('A', new BodyweightSet(10, null, null, null));
      TestBed.tick();

      expect(sessionStore.save).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(999);
      expect(sessionStore.save).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1);
      expect(sessionStore.save).toHaveBeenCalledWith(service.$session());
    });

    it('should not auto-save empty session draft changes', async () => {
      service.patchStartedAt(Temporal.Instant.from('2025-01-01T10:00:00Z'));
      TestBed.tick();

      vi.advanceTimersByTime(1000);

      expect(sessionStore.save).not.toHaveBeenCalled();
    });
  });

  describe('Existing unfinished session', () => {
    beforeEach(() => {
      const session = Session.createEmpty().addExercise('A');
      configureTestingModule(session);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('$isEditable should return true when the initial session has no finishedAt', () => {
      expect(service.$isEditable()).toBe(true);
    });

    it('$isUnfinished should return true when the initial session has no finishedAt', () => {
      expect(service.$isUnfinished()).toBe(true);
    });

    it('$session should use the injected initial session', () => {
      expect(service.$session().exercises).toEqual([new ExerciseLog('A')]);
    });
  });

  describe('Existing finished session', () => {
    const finishedAt = Temporal.Instant.from('2025-01-01T11:00:00Z');

    beforeEach(() => {
      const session = Session.createEmpty();
      session.finishedAt = finishedAt;

      configureTestingModule(session);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('$isEditable should return false when the initial session is finished', () => {
      expect(service.$isEditable()).toBe(false);
    });

    it('$isUnfinished should return false when the initial session is finished', () => {
      expect(service.$isUnfinished()).toBe(false);
    });

    it('should allow making a finished session editable', () => {
      service.makeEditable();

      expect(service.$isEditable()).toBe(true);
    });
  });
});
