import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { SetDeletedEvent } from './set-deleted.event';
import { SetDeletedEventHandler } from './set-deleted-event.handler';
import { SetRepository } from '../../../persistence/repository/set.repository';

describe('SetDeletedEventHandler', () => {
  let setRepositoryMock: { deleteSet: Mock };
  let handler: SetDeletedEventHandler;

  beforeEach(() => {
    setRepositoryMock = { deleteSet: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: SetRepository, useValue: setRepositoryMock }, SetDeletedEventHandler],
    });

    handler = TestBed.inject(SetDeletedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(SetDeletedEvent));

  it('should delete a set', () => {
    const event = new SetDeletedEvent(5);

    handler.handle(event);

    expect(setRepositoryMock.deleteSet).toHaveBeenCalledExactlyOnceWith(event.setId);
  });
});
