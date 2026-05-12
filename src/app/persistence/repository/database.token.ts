import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const DATABASE_TOKEN = new InjectionToken<Observable<IDBDatabase>>('Database');
