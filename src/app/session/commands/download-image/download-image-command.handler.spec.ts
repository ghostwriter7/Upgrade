import { describe, Mock, test, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DownloadImageCommandHandler } from '@session/commands/download-image/download-image-command.handler';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { DownloadImageCommand } from '@session/commands/download-image/download-image.command';
import { createNanoId } from '@common/function/create-uuid.function';

describe('DownloadImageCommandHandler', () => {
  let exerciseLogRepository: { findLogById: Mock };
  let handler: DownloadImageCommandHandler;

  let createWritable: Mock;
  let writable: {
    write: Mock;
    close: Mock;
    abort: Mock;
  };
  let showSaveFilePicker: Mock;

  beforeEach(() => {
    createWritable = vi.fn();
    writable = {
      write: vi.fn(),
      close: vi.fn(),
      abort: vi.fn(),
    };
    showSaveFilePicker = vi.fn();
    createWritable.mockResolvedValue(writable);
    showSaveFilePicker.mockResolvedValue({ createWritable });
    Object.defineProperty(window, 'showSaveFilePicker', {
      configurable: true,
      writable: true,
      value: showSaveFilePicker,
    });

    exerciseLogRepository = { findLogById: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ExerciseLogRepository, useValue: exerciseLogRepository },
        DownloadImageCommandHandler,
      ],
    });

    handler = TestBed.inject(DownloadImageCommandHandler);
  });

  test('should save a file successfully', async () => {
    const command = new DownloadImageCommand(new Blob([]), createNanoId());

    const blob = new Blob(['image'], { type: 'image/jpeg' });

    exerciseLogRepository.findLogById.mockResolvedValue({
      id: command.exerciseLogId,
      exerciseId: 'horse-stance-squat',
      createdAt: Temporal.Instant.from('2026-08-09T00:00:00Z'),
    });

    await handler.handle(command);

    expect(showSaveFilePicker).toHaveBeenCalledExactlyOnceWith({
      suggestedName: `2026-08-09-horse-stance-squat.jpeg`,
      types: [
        {
          accept: {
            ['image/jpeg']: ['.jpeg'],
          },
        },
      ],
    });

    expect(createWritable).toHaveBeenCalledOnce();
    expect(writable.write).toHaveBeenCalledExactlyOnceWith(blob);
    expect(writable.close).toHaveBeenCalledOnce();
    expect(writable.abort).not.toHaveBeenCalled();
  });
});
