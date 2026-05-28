import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ExportDataService } from '../../services/export-data.service';
import { Loader } from '../../../ui/loader/loader';

@Component({
  selector: 'app-backup-page',
  imports: [MatButton, Loader],
  templateUrl: './backup-page.html',
  styleUrl: './backup-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BackupPage {
  protected readonly loading = signal(false);
  private readonly exportDataService = inject(ExportDataService);

  protected exportData(): void {
    this.loading.set(true);
    this.exportDataService.exportData();
  }
}
