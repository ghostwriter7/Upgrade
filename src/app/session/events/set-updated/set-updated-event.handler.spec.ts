import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { SetUpdatedEvent } from './set-updated.event';
import { SetUpdatedEventHandler } from './set-updated-event.handler';
import { SetRepository } from '@persistence/repository/set.repository';
import { bwSet } from '@test/fixtures/exercise-set.fixtures';

describe('SetUpdatedEventHandler', () => {
  let setRepositoryMock: { upsertSet: Mock };
  let handler: SetUpdatedEventHandler;

  beforeEach(() => {
    setRepositoryMock = { upsertSet: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: SetRepository, useValue: setRepositoryMock }, SetUpdatedEventHandler],
    });

    handler = TestBed.inject(SetUpdatedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(SetUpdatedEvent));

  it('should update a set', () => {
    const event = new SetUpdatedEvent(bwSet(0, 10));

    handler.handle(event);

    expect(setRepositoryMock.upsertSet).toHaveBeenCalledExactlyOnceWith(event.set);
  });
});
