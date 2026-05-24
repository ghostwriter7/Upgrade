import { TestBed } from '@angular/core/testing';
import { describe, it, vi, beforeEach, Mock } from 'vitest';

import { SessionEditorService } from './session-editor.service';
import { SessionStore } from '../../store/session/session.store';
import { DialogService } from '../../common/service/dialog/dialog.service';
import {
  BodyweightSet,
  BodyweightSetBuilder,
  ExerciseSet,
} from '../../domain/model/exercise-set.model';
import { ExerciseLog, Session } from '../../domain/model/session.model';
import { SESSION } from '../consts/session.token';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { EditNote } from '../edit-note/edit-note';
import { ExerciseSelector } from '../exercise-selector/exercise-selector';
import { MediaRepository } from '../../persistence/repository/media.repository';
import { SetRepository } from '../../persistence/repository/set.repository';
import { SessionRepository } from '../../persistence/repository/session.repository';

describe('SessionEditor', () => {
  let service: SessionEditorService;
  let sessionStore: { updateCache: Mock };
  let dialogService: { open: Mock };
  let mediaRepository: { deleteMedia: Mock; save: Mock };
  let setRepository: {
    upsertSet: Mock;
    deleteSet: Mock;
  };
  let sessionRepository: { save: Mock };

  const mockExerciseExists = (exerciseId: string): void => {
    service['sessionDraft'].update((s) => s.addExercise(exerciseId));
  };

  const addSet = (set: ExerciseSet): void => {
    service['sessionDraft'].update((session) => session.addSet(set));
  };

  const configureTestingModule = (session: Session = Session.createEmpty()): void => {
    sessionStore = { updateCache: vi.fn() };
    dialogService = { open: vi.fn() };
    mediaRepository = { deleteMedia: vi.fn(), save: vi.fn() };
    setRepository = { upsertSet: vi.fn(), deleteSet: vi.fn() };
    sessionRepository = { save: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: SessionStore, useValue: sessionStore },
        { provide: DialogService, useValue: dialogService },
        { provide: MediaRepository, useValue: mediaRepository },
        { provide: SetRepository, useValue: setRepository },
        { provide: SessionRepository, useValue: sessionRepository },
        SessionEditorService,
        { provide: SESSION, useValue: session },
      ],
    });

    service = TestBed.inject(SessionEditorService);
  };

  const CHIN_UPS = 'chin-ups';
  const SIDE_SPLITS = 'side-splits';

  const chinUpsSet = (index: number, reps: number, id?: number): BodyweightSet =>
    new BodyweightSetBuilder()
      .withReps(reps)
      .withIndex(index)
      .withExerciseId(CHIN_UPS)
      .withSessionId(service.$session().uuid)
      .withId(id)
      .build();

  describe('New Session', () => {
    beforeEach(() => {
      configureTestingModule();
      vi.useFakeTimers();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
      vi.useRealTimers();
    });

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
        mockExerciseExists(CHIN_UPS);
        addSet(chinUpsSet(0, 10));

        expect(service.$isSessionInvalid()).toBe(false);
      });
    });

    it('$isUnfinished should return true for the new session as it has not yet been completed', () =>
      expect(service.$isUnfinished()).toBe(true));

    it('should add a set to an exercise', async () => {
      mockExerciseExists(SIDE_SPLITS);
      mockExerciseExists(CHIN_UPS);
      const initialSet = chinUpsSet(0, 1);
      const userSet = chinUpsSet(0, 10);
      const setId = 500;
      setRepository.upsertSet.mockResolvedValue(setId);

      service.displaySetForm(CHIN_UPS);
      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      await callback(userSet);

      expect(dialogService.open).toHaveBeenCalledWith(UpsertSet, expect.any(Function), {
        data: {
          set: initialSet,
          label: 'Add Set',
          button: 'Save',
        },
      });
      expect(service.$session().exercises).toEqual([
        new ExerciseLog(SIDE_SPLITS),
        new ExerciseLog(CHIN_UPS).withSet(userSet),
      ]);
      expect(userSet.id).toEqual(setId);
      expect(setRepository.upsertSet).toHaveBeenCalledExactlyOnceWith(userSet);
      expect(sessionRepository.save).toHaveBeenCalledExactlyOnceWith(service.$session());
    });

    it('should delete a set from an exercise', () => {
      mockExerciseExists(CHIN_UPS);
      const set = chinUpsSet(0, 10, 200);
      addSet(set);

      service.deleteSet(set);

      expect(service.$session().exercises).toEqual([new ExerciseLog(CHIN_UPS)]);
      expect(setRepository.deleteSet).toHaveBeenCalledExactlyOnceWith(set.id);
      expect(setRepository.upsertSet).not.toHaveBeenCalled();
    });

    it('should delete a set from an exercise and update all the affected sets', () => {
      mockExerciseExists(CHIN_UPS);
      const set = chinUpsSet(0, 10, 200);
      const nextSet = chinUpsSet(1, 10, 201);
      const nextSet2 = chinUpsSet(2, 10, 202);
      addSet(set);
      addSet(nextSet);
      addSet(nextSet2);

      service.deleteSet(set);

      expect(service.$session().exercises).toEqual([new ExerciseLog(CHIN_UPS)]);
      expect(setRepository.deleteSet).toHaveBeenCalledExactlyOnceWith(set.id);
      expect(setRepository.upsertSet).toHaveBeenCalledTimes(2);
      expect(setRepository.upsertSet).toHaveBeenCalledWith(nextSet);
      expect(setRepository.upsertSet).toHaveBeenCalledWith(nextSet2);
    });

    it('should edit a set through the edit set dialog result callback', () => {
      const originalSet = chinUpsSet(0, 10);
      const editedSet = chinUpsSet(0, 20);
      mockExerciseExists(CHIN_UPS);
      addSet(originalSet);

      service.editSet(originalSet);

      expect(dialogService.open).toHaveBeenCalledWith(UpsertSet, expect.any(Function), {
        data: { set: originalSet },
      });

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback(editedSet);

      expect(service.$session().exercises).toEqual([new ExerciseLog(CHIN_UPS).withSet(editedSet)]);
      expect(setRepository.upsertSet).toHaveBeenCalledExactlyOnceWith(editedSet);
    });

    it('should complete the session, save it immediately and make it non-editable', () => {
      mockExerciseExists(CHIN_UPS);
      addSet(chinUpsSet(0, 10));

      service.completeSession();

      expect(service.$session().finishedAt).toBeInstanceOf(Temporal.Instant);
      expect(service.$isUnfinished()).toBe(false);
      expect(service.$isEditable()).toBe(false);
      expect(sessionStore.updateCache).toHaveBeenCalledWith(service.$session());
      expect(sessionRepository.save).toHaveBeenCalledExactlyOnceWith(service.$session());
    });

    it('should patch startedAt', () => {
      const startedAt = Temporal.Instant.from('2025-01-01T10:00:00Z');

      service.patchStartedAt(startedAt);

      expect(service.$session().startedAt).toBe(startedAt);
      expect(sessionRepository.save).toHaveBeenCalledExactlyOnceWith(service.$session());
    });

    it('should patch finishedAt', () => {
      const finishedAt = Temporal.Instant.from('2025-01-01T11:00:00Z');

      service.patchFinishedAt(finishedAt);

      expect(service.$session().finishedAt).toBe(finishedAt);
      expect(service.$isUnfinished()).toBe(false);
      expect(sessionRepository.save).toHaveBeenCalledExactlyOnceWith(service.$session());
    });

    it('should delete an exercise through the confirm delete dialog callback', () => {
      mockExerciseExists(CHIN_UPS);
      mockExerciseExists(SIDE_SPLITS);
      const entry = service.$session().exercises[0];

      service.deleteExercise(entry);

      expect(dialogService.open).toHaveBeenCalledWith(ConfirmDeleteAlert, expect.any(Function));

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback();

      expect(service.$session().exercises).toEqual([new ExerciseLog(SIDE_SPLITS)]);
      expect(sessionRepository.save).toHaveBeenCalledExactlyOnceWith(service.$session());
      expect(setRepository.deleteSet).not.toHaveBeenCalled();
    });

    it('should delete an exercise and its associated sets through the confirm delete dialog callback', () => {
      mockExerciseExists(SIDE_SPLITS);
      mockExerciseExists(CHIN_UPS);
      const firstSet = chinUpsSet(0, 10, 200);
      addSet(firstSet);
      const secondSet = chinUpsSet(1, 20, 201);
      addSet(secondSet);
      const entry = service.$session().exercises[1];

      service.deleteExercise(entry);

      expect(dialogService.open).toHaveBeenCalledWith(ConfirmDeleteAlert, expect.any(Function));

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback();

      expect(service.$session().exercises).toEqual([new ExerciseLog(SIDE_SPLITS)]);
      expect(sessionRepository.save).toHaveBeenCalledExactlyOnceWith(service.$session());
      expect(setRepository.deleteSet).toHaveBeenCalledTimes(2);
      expect(setRepository.deleteSet).toHaveBeenCalledWith(firstSet.id);
      expect(setRepository.deleteSet).toHaveBeenCalledWith(secondSet.id);
    });

    it('should edit exercise notes through the edit note dialog result callback', () => {
      mockExerciseExists(CHIN_UPS);
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
      expect(sessionRepository.save).toHaveBeenCalledExactlyOnceWith(service.$session());
    });

    it('should only accept string values from the edit note dialog', () => {
      mockExerciseExists(CHIN_UPS);
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
      callback(new Set([CHIN_UPS, SIDE_SPLITS]));

      expect(service.$session().exercises).toEqual([
        new ExerciseLog(CHIN_UPS),
        new ExerciseLog(SIDE_SPLITS),
      ]);
      expect(sessionRepository.save).toHaveBeenCalledExactlyOnceWith(service.$session());
    });

    it('should not add exercises when exercise selector returns an empty set', () => {
      service.showExerciseDialog();

      const [, callback] = dialogService.open.mock.calls.at(-1)!;
      callback(new Set<string>());

      expect(service.$session().exercises).toEqual([]);
      expect(sessionRepository.save).not.toHaveBeenCalled();
    });

    it('should auto-save non-empty session draft changes', async () => {
      mockExerciseExists(CHIN_UPS);
      TestBed.tick();
      addSet(chinUpsSet(0, 10));
      TestBed.tick();

      expect(sessionStore.updateCache).toHaveBeenCalledWith(service.$session());
    });

    it('should copy an existing set', async () => {
      mockExerciseExists(CHIN_UPS);
      const setA = chinUpsSet(0, 10, 200);
      const setB = chinUpsSet(1, 20, 201);
      addSet(setA);
      addSet(setB);
      setRepository.upsertSet.mockReturnValueOnce(202);
      const expectedSet = chinUpsSet(2, 20, 202);

      await service.copySet(setB);

      expect(setRepository.upsertSet).toHaveBeenCalledExactlyOnceWith(expectedSet);
      expect(service.$session().exercises).toEqual([
        new ExerciseLog(CHIN_UPS)
          .withSet(setA)
          .withSet(setB)
          .withSet(expectedSet)
      ]);
    });
  });

  describe('Existing unfinished session', () => {
    beforeEach(() => {
      const session = Session.createEmpty().addExercise(CHIN_UPS);
      configureTestingModule(session);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('$isUnfinished should return true when the initial session has no finishedAt', () => {
      expect(service.$isUnfinished()).toBe(true);
    });

    it('$session should use the injected initial session', () => {
      expect(service.$session().exercises).toEqual([new ExerciseLog(CHIN_UPS)]);
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
  });
});
