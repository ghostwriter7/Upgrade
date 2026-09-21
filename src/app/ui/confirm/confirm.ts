import { Component, input, output } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirm',
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFabButton,
    MatIcon,
  ],
  templateUrl: './confirm.html',
  styleUrl: './confirm.css',
  host: {
    display: 'd-contents',
  },
})
export class Confirm {
  public readonly title = input.required<string>();
  public readonly message = input.required<string>();
  public readonly confirm = output<void>();
}
