import { Component, DOCUMENT, inject } from '@angular/core';
import { LayoutComponent } from '@ui/layout/layout.component';
import { ElementClickedEvent } from '@common/events/element-clicked.event';
import { EventService } from '@common/service/event/event.service';
import { IconRegistry } from '@common/service/icon-registry/icon-registry';
import { MediaRepository } from '@persistence/repository/media.repository';
import { FileService } from '@common/service/file/file.service';

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

  private readonly mediaRepository = inject(MediaRepository);
  private readonly fileService = inject(FileService);

  constructor() {
    this.document.body.addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof Element) {
        this.eventService.dispatch(new ElementClickedEvent(target));
      }
    });

    this.mediaRepository.getAllMedia().then((records) => {
      for (const record of records) {
        this.fileService.persist(`${record.exerciseId}-${record.id}.jpeg`, record.blob);
      }
    });
  }
}
