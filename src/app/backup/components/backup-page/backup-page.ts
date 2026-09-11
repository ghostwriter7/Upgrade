import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ExportDataService } from '../../services/export-data/export-data.service';
import { Loader } from '@ui/loader/loader';
import { ImportDataService } from '../../services/import-data/import-data.service';
import { BackupSummary } from '@backup/interfaces/summary.interface';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-backup-page',
  imports: [MatButton, Loader, MatCard, MatCardTitle, MatCardContent, MatCardHeader],
  templateUrl: './backup-page.html',
  styleUrl: './backup-page.css',
})
export default class BackupPage {
  protected readonly loading = signal(false);
  protected readonly error = signal<unknown>(null);
  protected readonly backupSummary = signal<null | BackupSummary>(null);

  private readonly exportDataService = inject(ExportDataService);
  private readonly importDataService = inject(ImportDataService);

  protected async exportDatabase(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.exportDataService.exportDatabase();
    } catch (error) {
      this.error.set(error);
    } finally {
      this.loading.set(false);
    }
  }

  protected exportData(): void {
    this.performOperation(() => this.exportDataService.exportData());
  }

  protected importData(): void {
    this.performOperation(() => this.importDataService.importData());
  }

  private async performOperation(operation: () => Promise<BackupSummary>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.backupSummary.set(null);
    try {
      const summary = await operation();
      this.backupSummary.set(summary);
    } catch (error) {
      this.error.set(error);
    } finally {
      this.loading.set(false);
    }
  }
}
