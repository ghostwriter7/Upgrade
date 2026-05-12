import { Injectable } from '@angular/core';
import { Session } from '../domain/model/session.model';
import { SessionFactory } from '../domain/factory/session.factory';
import { GenericRepository } from './generic.repository';
import { StoreName } from './store-name.enum';

@Injectable({ providedIn: 'root'})
export class SessionRepository extends GenericRepository<Session> {

  constructor() {
    super();
  }

  public override async findAll(): Promise<Session[]> {
    const results = await super.findAll(StoreName.SESSIONS);
    return results.map(SessionFactory.fromJSON);
  }

  public save(session: Session): Promise<void> {
    return super.put(StoreName.SESSIONS, session);
  }

  public override delete(sessionId: string): Promise<boolean> {
    return super.delete(StoreName.SESSIONS, sessionId);
  }
}
