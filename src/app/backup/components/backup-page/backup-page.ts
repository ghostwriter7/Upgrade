import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ExportDataService } from '../../services/export-data/export-data.service';
import { Loader } from '@ui/loader/loader';
import { ImportDataService } from '../../services/import-data/import-data.service';

@Component({
  selector: 'app-backup-page',
  imports: [MatButton, Loader],
  templateUrl: './backup-page.html',
  styleUrl: './backup-page.css',
})
export default class BackupPage {
  protected readonly loading = signal(false);
  protected readonly error = signal<unknown>(null);

  private readonly exportDataService = inject(ExportDataService);
  private readonly importDataService = inject(ImportDataService);

  protected async exportDatabase(): Promise<void> {
    this.performOperation(() => this.exportDataService.exportDatabase());
  }

  protected async importDatabase(): Promise<void> {
    this.performOperation(() => this.importDataService.importDatabase());
  }

  protected exportData(): void {
    this.performOperation(() => this.exportDataService.exportData());
  }

  protected importData(): void {
    this.performOperation(() => this.importDataService.importData());
  }

  private async performOperation(operation: () => Promise<void>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await operation();
    } catch (error) {
      this.error.set(error);
    } finally {
      this.loading.set(false);
    }
  }
}
