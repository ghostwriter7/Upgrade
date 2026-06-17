import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { SetCreatedEvent } from './set-created.event';
import { SetCreatedEventHandler } from './set-created-event.handler';
import { SetRepository } from '@persistence/repository/set.repository';
import { bwSet } from '@test/fixtures/exercise-set.fixtures';

describe('SetCreatedEventHandler', () => {
  let setRepositoryMock: { upsertSet: Mock };
  let handler: SetCreatedEventHandler;

  beforeEach(() => {
    setRepositoryMock = { upsertSet: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: SetRepository, useValue: setRepositoryMock }, SetCreatedEventHandler],
    });

    handler = TestBed.inject(SetCreatedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(SetCreatedEvent));

  it('should save a set', () => {
    const event = new SetCreatedEvent(bwSet(0, 10));

    handler.handle(event);

    expect(setRepositoryMock.upsertSet).toHaveBeenCalledExactlyOnceWith(event.set);
  });
});
