import { Component, inject, OnInit, signal } from '@angular/core';
import { FileService } from '@common/service/file/file.service';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-more-page',
  imports: [MatIcon, MatRipple, RouterLink],
  templateUrl: './more-page.html',
  styleUrl: './more-page.css',
  host: {
    class: 'page',
  },
})
export default class MorePage implements OnInit {
  private readonly fileService = inject(FileService);

  protected readonly storageEstimate = signal<StorageEstimate | null>(null);

  protected readonly items = [
    { path: '/backup', icon: 'backup', label: 'Backup' }
  ];

  public ngOnInit(): void {
    this.fileService.checkQuota().then(({ usage, quota }) =>
      this.storageEstimate.set({
        usage: toMegaBytes(usage),
        quota: toMegaBytes(quota),
      }),
    );
  }
}

function toMegaBytes(bytes: number | undefined): number {
  return bytes ? Math.floor(bytes / 1000000) : 0;
}
