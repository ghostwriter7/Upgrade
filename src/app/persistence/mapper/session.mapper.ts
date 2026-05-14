import { SessionDto } from '../schema/session.schema';
import { Session } from '../../domain/model/session.model';
import { DateHelper } from '../../common/helper/date.helper';
import { ExerciseEntryMapper } from './exercise-entry.mapper';

export class SessionMapper {
  public static toDomain(sessionDto: SessionDto): Session {
    const session = new Session(sessionDto.uuid, DateHelper.from(sessionDto.createdAt));

    session.startedAt = DateHelper.from(sessionDto.startedAt);
    session.finishedAt = sessionDto.finishedAt ? DateHelper.from(sessionDto.finishedAt) : null;
    session.notes = sessionDto.notes;
    session.exercises = sessionDto.exerciseEntries.map(ExerciseEntryMapper.toDomain);

    return session;
  }

  public static toDto(session: Session): SessionDto {
    return {
      uuid: session.uuid,
      createdAt: session.createdAt.toString({ smallestUnit: 'second'}),
      startedAt: session.startedAt.toString({ smallestUnit: 'second'}),
      finishedAt: session.finishedAt ? session.finishedAt.toString({ smallestUnit: 'second'}) : null,
      notes: session.notes,
      exerciseEntries: session.exercises.map(ExerciseEntryMapper.toDto),
    }
  }
}
