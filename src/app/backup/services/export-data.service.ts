import { inject, Injectable } from '@angular/core';
import { SessionRepository } from '../../persistence/repository/session.repository';
import { SetRepository } from '../../persistence/repository/set.repository';
import { SessionMapper } from '../../persistence/mapper/session/session.mapper';
import { ExerciseSetMapper } from '../../persistence/mapper/exercise-set/exercise-set.mapper';

@Injectable({ providedIn: 'root' })
export class ExportDataService {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);

  public async exportData(): Promise<void> {
    const [sessions, sets] = await Promise.all([
      this.sessionRepository.getAllSessions(),
      this.setRepository.getAllSets(),
    ]);

    const json = JSON.stringify(
      {
        sessions: sessions.map(SessionMapper.INSTANCE.toDto),
        sets: sets.map(ExerciseSetMapper.INSTANCE.toDto),
      },
      null,
      2,
    );

    const handle = await window.showSaveFilePicker({
      suggestedName: `upgrade-backup-${Temporal.Now.plainDateISO().toString()}`,
      types: [
        {
          description: 'Upgrade Backup',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });
    const writableStream = await handle.createWritable();

    await writableStream.write(json);
    await writableStream.close();
  }
}
