import { Injectable } from '@angular/core';
import { Session } from '../../domain/model/session.model';
import { GenericRepository } from './generic.repository';
import { StoreName } from './store-name.enum';
import { SessionDto, SessionSchema } from '../schema/session.schema';
import { SessionMapper } from '../mapper/session.mapper';

@Injectable({ providedIn: 'root'})
export class SessionRepository extends GenericRepository<SessionDto> {

  constructor() {
    super();
  }

  public override async findAll(): Promise<Session[]> {
    const results = await super.findAll(StoreName.SESSIONS);
    const dtos: SessionDto[] = results.map((data) => SessionSchema.parse(data));
    return dtos.map(SessionMapper.toDomain);
  }

  public save(session: Session): Promise<void> {
    const dto = SessionMapper.toDto(session);
    return super.put(StoreName.SESSIONS, dto);
  }

  public override delete(sessionId: string): Promise<boolean> {
    return super.delete(StoreName.SESSIONS, sessionId);
  }
}
