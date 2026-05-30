import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { MediaCapturedEvent } from './media-captured.event';
import { MediaRepository } from '../../../persistence/repository/media.repository';
import { ExerciseMedia } from '../../../domain/model/exercise-media.model';
import { MediaCapturedEventHandler } from './media-captured-event.handler';

describe('MediaCapturedEventHandler', () => {
  let mediaRepositoryMock: { save: Mock };
  let handler: MediaCapturedEventHandler;

  beforeEach(() => {
    mediaRepositoryMock = { save: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: MediaRepository, useValue: mediaRepositoryMock },
        MediaCapturedEventHandler,
      ],
    });

    handler = TestBed.inject(MediaCapturedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(MediaCapturedEvent));

  it('should persist captured exercise media', () => {
    const event = new MediaCapturedEvent(
      ExerciseMedia.newImage('exerciseId', 'sessionId', new Blob(), 100, 100),
    );

    handler.handle(event);

    expect(mediaRepositoryMock.save).toHaveBeenCalledExactlyOnceWith(event.media);
  });
});
