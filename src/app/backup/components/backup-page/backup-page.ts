import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-backup-page',
  imports: [MatButton],
  templateUrl: './backup-page.html',
  styleUrl: './backup-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BackupPage {}
