import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PersistenceService {

  public persist(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public retrieve(key: string): unknown {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
