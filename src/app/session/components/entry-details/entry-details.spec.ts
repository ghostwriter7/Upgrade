import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDetails } from './entry-details';
import { TestBedUtils } from '../../../../test/test-bed.utils';
import { MediaRepository } from '../../../persistence/repository/media.repository';
import { Mock } from 'vitest';
import { BottomSheetTestHost } from '../../../../test/hosts/bottom-sheet-test-host';
import { ExerciseLog } from '../../../domain/model/exercise-log.model';

describe('EntryDetails', () => {
  let fixture: ComponentFixture<BottomSheetTestHost>;
  let openSheet: (data: { exerciseLog: ExerciseLog }) => void;
  let mediaRepositoryMock: { findMedia: Mock };

  beforeEach(async () => {
    mediaRepositoryMock = { findMedia: vi.fn() };
    const result = await TestBedUtils.configureForBottomSheet({
      targetComponent: EntryDetails,
      providers: [{ provide: MediaRepository, useValue: mediaRepositoryMock }],
    });

    fixture = result.fixture;
    openSheet = (data) => result.openSheet(data);
  });

  it('should render no media when none is available', () => {
    openSheet({ exerciseLog: new ExerciseLog('sessionId','any id') });

    const images = fixture.debugElement.nativeElement.querySelectorAll('img');
    expect(images.length).toBe(0);
  });
});
