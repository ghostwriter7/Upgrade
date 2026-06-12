import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Session } from '@domain/model/session/session.model';

@Component({
  selector: 'app-session-header',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div>Session Header</div>',
})
export class SessionHeaderMock {
  public isEditable = input(false);
  public isNew = input(false);
  public session = input<Session | null>(null);
}
