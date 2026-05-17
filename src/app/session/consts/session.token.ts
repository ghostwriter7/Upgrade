import { InjectionToken } from '@angular/core';
import { Session } from '../../domain/model/session.model';

export const SESSION = new InjectionToken<Session>('Session');
