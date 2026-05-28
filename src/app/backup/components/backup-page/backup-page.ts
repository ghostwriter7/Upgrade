import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ExportDataService } from '../../services/export-data.service';
import { Loader } from '../../../ui/loader/loader';
import { ImportDataService } from '../../services/import-data.service';

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
  private readonly importDataService = inject(ImportDataService);

  protected async exportData(): Promise<void> {
    this.loading.set(true);
    try {
      await this.exportDataService.exportData();
    } catch (error) {
      alert(error);
    } finally {
      this.loading.set(false);
    }
  }

  protected async importData(): Promise<void> {
    this.loading.set(true);
    try {
      await this.importDataService.importData();
    } catch (error) {
      alert(error);
    } finally {
      this.loading.set(false);
    }
  }
}
