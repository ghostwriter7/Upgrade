import { TestBed } from '@angular/core/testing';
import { describe, it, vi, beforeEach, Mock } from 'vitest';

import { SessionEditorService } from './session-editor.service';
import { SessionStore } from '../../store/session/session.store';
import { DialogService } from '../../common/service/dialog/dialog.service';
import { BodyweightSet } from '../../domain/model/exercise-set.model';
import { ExerciseLog, Session } from '../../domain/model/session.model';
import { SESSION } from '../consts/session.token';
import { EditSet } from '../edit-set/edit-set';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { EditNote } from '../edit-note/edit-note';
import { ExerciseSelector } from '../exercise-selector/exercise-selector';

describe('SessionEditor', () => {
  let service: SessionEditorService;
  let sessionStore: { save: Mock };
  let dialogService: { open: Mock };

  const mockExerciseExists = (exerciseId: string): void => {
    service['sessionDraft'].update((s) => s.addExercise(exerciseId));
  };

  const configureTestingModule = (session?: Session): void => {
    sessionStore = { save: vi.fn() };
    dialogService = { open: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionStore, useValue: sessionStore },
        { provide: DialogService, useValue: dialogService },
        SessionEditorService,
        ...(session ? [{ provide: SESSION, useValue: session }] : []),
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
        service.addSet(new BodyweightSet(10, null, null, null), exerciseId);

        expect(service.$isSessionInvalid()).toBe(false);
      });
    });

    describe('$setFormActiveForExerciseId', () => {
      it('should return null when the set form has not been opened yet', () =>
        expect(service.$setFormActiveForExerciseId()).toBeNull());

      it('should return exercise ID when the set form has been opened for a specific exercise', () => {
        const exerciseId = 'exerciseId';
        service.showSetFormForExerciseId(exerciseId);

        expect(service.$setFormActiveForExerciseId()).toBe(exerciseId);
      });
    });

    it('$isUnfinished should return true for the new session as it has not yet been completed', () =>
      expect(service.$isUnfinished()).toBe(true));

    it('should add a set to an exercise', () => {
      mockExerciseExists('A');
      mockExerciseExists('B');
      const set = new BodyweightSet(10, null, null, null);

      service.addSet(set, 'B');

      expect(service.$setFormActiveForExerciseId()).toBeNull();
      expect(service.$session().exercises).toEqual([
        new ExerciseLog('A'),
        new ExerciseLog('B').withSet(set),
      ]);
    });

    it('should delete a set from an exercise', () => {
      mockExerciseExists('A');
      const set = new BodyweightSet(10, null, null, null);
      service.addSet(set, 'A');

      service.deleteSet('A', 0);

      expect(service.$session().exercises).toEqual([new ExerciseLog('A')]);
    });

    it('should edit a set through the edit set dialog result callback', () => {
      const originalSet = new BodyweightSet(10, null, null, null);
      const editedSet = new BodyweightSet(20, null, null, null);
      mockExerciseExists('A');
      service.addSet(originalSet, 'A');

      service.editSet('A', originalSet, 0);

      expect(dialogService.open).toHaveBeenCalledWith(EditSet, expect.any(Function), {
        data: { set: originalSet },
      });

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback(editedSet);

      expect(service.$session().exercises).toEqual([new ExerciseLog('A').withSet(editedSet)]);
    });

    it('should complete the session, save it immediately and make it non-editable', () => {
      mockExerciseExists('A');
      service.addSet(new BodyweightSet(10, null, null, null), 'A');

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


    it('should copy the last set for an exercise', () => {
      const firstSet = new BodyweightSet(10, null, null, null);

      mockExerciseExists('A');
      service.addSet(firstSet, 'A');

      service.copyLastSet('A');

      expect(service.$session().exercises).toEqual([
        new ExerciseLog('A').withSet(firstSet).withSet(firstSet),
      ]);
    });

    it('should make the session editable', () => {
      service.cancelEdit();

      service.makeEditable();

      expect(service.$isEditable()).toBe(true);
    });

    it('should cancel edit mode', () => {
      service.makeEditable();

      service.cancelEdit();

      expect(service.$isEditable()).toBe(false);
    });

    it('should cancel add set mode', () => {
      service.showSetFormForExerciseId('A');

      service.cancelAddSet();

      expect(service.$setFormActiveForExerciseId()).toBeNull();
    });

    it('should auto-save non-empty session draft changes after debounce', async () => {
      mockExerciseExists('A');
      TestBed.tick();
      service.addSet(new BodyweightSet(10, null, null, null), 'A');
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

    it('should cancel editing a finished session', () => {
      service.makeEditable();

      service.cancelEdit();

      expect(service.$isEditable()).toBe(false);
    });
  });
});
