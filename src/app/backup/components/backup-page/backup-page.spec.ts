import { ComponentFixture, TestBed } from '@angular/core/testing';

import BackupPage from './backup-page';
import { Mock } from 'vitest';
import { ImportDataService } from '../../services/import-data/import-data.service';
import { ExportDataService } from '../../services/export-data/export-data.service';
import { By } from '@angular/platform-browser';

describe('BackupPage', () => {
  let component: BackupPage;
  let fixture: ComponentFixture<BackupPage>;
  let importDataService: { importData: Mock };
  let exportDataService: { exportData: Mock };

  beforeEach(async () => {
    importDataService = { importData: vi.fn() };
    exportDataService = { exportData: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [BackupPage],
      providers: [
        { provide: ImportDataService, useValue: importDataService },
        { provide: ExportDataService, useValue: exportDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackupPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const getLoader = () => fixture.debugElement.query(By.css('[data-testid="backup-loader"]'));
  const getError = () =>
    fixture.debugElement.query(By.css('[data-testid="backup-error-message"]'))?.nativeElement as
      | HTMLDivElement
      | undefined;

  const clickImportButton = () => fixture.debugElement.query(By.css('[data-testid="backup-import-data-btn"]'))
    .triggerEventHandler('click', null);
  const clickExportButton = () => fixture.debugElement.query(By.css('[data-testid="backup-export-data-btn"]'))
    .triggerEventHandler('click', null);

  it('should trigger data export', async () => {
    exportDataService.exportData.mockResolvedValue(null);
    clickExportButton();

    expect(getLoader()).toBeDefined();

    await Promise.resolve();
    TestBed.tick();

    expect(getLoader()).toBeNull();
    expect(getError()).toBeUndefined();
    expect(exportDataService.exportData).toHaveBeenCalledOnce();
  });

  it('should render an error on data export', async () => {
    exportDataService.exportData.mockRejectedValue(new Error('Error occurred'));
    clickExportButton();

    expect(getLoader()).toBeDefined();

    await Promise.resolve();
    TestBed.tick();

    expect(getLoader()).toBeNull();
    expect(getError()?.textContent).toContain('Error occurred');
    expect(exportDataService.exportData).toHaveBeenCalledOnce();
  });

  it('should trigger data import', async () => {
    importDataService.importData.mockResolvedValue(null);
    clickImportButton();

    expect(getLoader()).toBeDefined();

    await Promise.resolve();
    TestBed.tick();

    expect(getLoader()).toBeNull();
    expect(getError()).toBeUndefined();
    expect(importDataService.importData).toHaveBeenCalledOnce();
  });

  it('should render an error on data import', async () => {
    importDataService.importData.mockRejectedValue(new Error('Error occurred'));
    clickImportButton();

    expect(getLoader()).toBeDefined();

    await Promise.resolve();
    TestBed.tick();

    expect(getLoader()).toBeNull();
    expect(getError()?.textContent).toContain('Error occurred');
    expect(importDataService.importData).toHaveBeenCalledOnce();
  });
});
