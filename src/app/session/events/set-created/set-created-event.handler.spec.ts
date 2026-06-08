import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { SetCreatedEvent } from './set-created.event';
import { SetCreatedEventHandler } from './set-created-event.handler';
import { SetRepository } from '@persistence/repository/set.repository';
import { BodyweightSet } from '@domain/model/exercise-set/exercise-set.model';

describe('SetCreatedEventHandler', () => {
  let setRepositoryMock: { upsertSet: Mock };
  let handler: SetCreatedEventHandler;

  beforeEach(() => {
    setRepositoryMock = { upsertSet: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: SetRepository, useValue: setRepositoryMock },
        SetCreatedEventHandler,
      ],
    });

    handler = TestBed.inject(SetCreatedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(SetCreatedEvent));

  it('should save a set', () => {
    const event = new SetCreatedEvent(new BodyweightSet('sessionId', 'exerciseId', 0, 10));

    handler.handle(event);

    expect(setRepositoryMock.upsertSet).toHaveBeenCalledExactlyOnceWith(event.set);
  });
});
