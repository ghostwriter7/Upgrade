import { Component, DOCUMENT, inject } from '@angular/core';
import { LayoutComponent } from '@ui/layout/layout.component';
import { ElementClickedEvent } from '@common/events/element-clicked.event';
import { EventService } from '@common/service/event/event.service';
import { IconRegistry } from '@common/service/icon-registry/icon-registry';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [LayoutComponent],
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly eventService = inject(EventService);
  private readonly iconRegistry = inject(IconRegistry);

  constructor() {
    this.document.body.addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof Element) {
        this.eventService.dispatch(new ElementClickedEvent(target));
      }
    });

    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./sql.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('hello');
    }
  }
}
