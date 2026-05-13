import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-delete-session-alert',
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle, MatButton, MatDialogClose],
  templateUrl: './delete-session-alert.html',
  styleUrl: './delete-session-alert.css',
})
export class DeleteSessionAlert {}
