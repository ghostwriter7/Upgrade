import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { MediaDeletedEvent } from './media-deleted.event';
import { MediaRepository } from '../../../persistence/repository/media.repository';
import { MediaDeletedEventHandler } from './media-deleted-event.handler';

describe('MediaDeletedEventHandler', () => {
  let mediaRepositoryMock: { deleteMedia: Mock };
  let handler: MediaDeletedEventHandler;

  beforeEach(() => {
    mediaRepositoryMock = { deleteMedia: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: MediaRepository, useValue: mediaRepositoryMock },
        MediaDeletedEventHandler,
      ],
    });

    handler = TestBed.inject(MediaDeletedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(MediaDeletedEvent));

  it('should delete an exercise media', () => {
    const event = new MediaDeletedEvent('id');

    handler.handle(event);

    expect(mediaRepositoryMock.deleteMedia).toHaveBeenCalledExactlyOnceWith(event.mediaId);
  });
});
