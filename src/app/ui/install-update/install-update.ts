import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { first } from 'rxjs';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-install-update',
  imports: [MatMiniFabButton, MatIcon],
  templateUrl: './install-update.html',
  styleUrl: './install-update.css',
})
export class InstallUpdate {
  private readonly swUpdate = inject(SwUpdate);

  protected readonly show = signal(false);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.swUpdate.versionUpdates
      .pipe(first((event) => event.type === 'VERSION_READY'))
      .subscribe(() => this.show.set(true));
  }

  protected reload(): void {
    this.document.location.reload();
  }
}
