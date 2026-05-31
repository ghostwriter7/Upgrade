import { SessionDto } from '../../schema/session.schema';
import { Session } from '../../../domain/model/session/session.model';
import { DateHelper } from '../../../common/helper/date.helper';
import { Mapper } from '../mapper.interface';

export class SessionMapper implements Mapper<Session, SessionDto> {
  public static readonly INSTANCE = new SessionMapper();

  public toDomain(sessionDto: SessionDto): Session {
    const session = new Session(sessionDto.uuid, DateHelper.from(sessionDto.createdAt));

    session.startedAt = DateHelper.from(sessionDto.startedAt);
    session.finishedAt = sessionDto.finishedAt ? DateHelper.from(sessionDto.finishedAt) : null;
    session.notes = sessionDto.notes;

    return session;
  }

  public toDto(session: Session): SessionDto {
    return {
      uuid: session.uuid,
      createdAt: session.createdAt.toString({ smallestUnit: 'second'}),
      startedAt: session.startedAt.toString({ smallestUnit: 'second'}),
      finishedAt: session.finishedAt ? session.finishedAt.toString({ smallestUnit: 'second'}) : null,
      notes: session.notes,
    }
  }
}
