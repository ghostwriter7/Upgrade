import { Component, DOCUMENT, inject } from '@angular/core';
import { LayoutComponent } from '@ui/layout/layout.component';
import { ElementClickedEvent } from '@common/events/element-clicked.event';
import { EventService } from '@common/service/event/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [LayoutComponent],
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly eventService = inject(EventService);

  constructor() {
    this.document.body.addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof Element) {
        this.eventService.dispatch(new ElementClickedEvent(target));
      }
    });
  }
}
