import { Injectable } from '@angular/core';
import { Session } from '../domain/model/session.model';
import { SessionFactory } from '../domain/factory/session.factory';

@Injectable({ providedIn: 'root'})
export class SessionRepository {
  public findAll(): Promise<Session[]> {
    const json = localStorage.getItem('sessions');
    const data = json ? JSON.parse(json) : [];
    const sessions = data.map(SessionFactory.fromJSON);
    return Promise.resolve(sessions);
  }

  public save(session: Session): Promise<void> {
    const existing = localStorage.getItem('sessions');
    const array = existing ? JSON.parse(existing) : [];

    if (!Array.isArray(array)) throw new TypeError('Sessions must be an array');

    localStorage.setItem('sessions', JSON.stringify([session, ...array]));
    return Promise.resolve();
  }
}
