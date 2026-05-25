import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-confirm-delete-alert',
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle, MatButton, MatDialogClose],
  templateUrl: './confirm-delete-alert.component.html',
  styleUrl: './confirm-delete-alert.component.css',
})
export class ConfirmDeleteAlert {}
