import { Injectable, Type } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly events = new Subject<object>();

  public dispatch<T extends object>(event: T): void {
    this.events.next(event);
  }

  public listen<T extends object>(clazz: Type<T>): Observable<T> {
    return this.events.pipe(
      filter((event): event is T => event instanceof clazz),
    );
  }
}
