import { Component, input } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'button[icon-button]',
  imports: [MatIcon],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.css',
  hostDirectives: [{
    inputs: ['extended'],
    directive: MatFabButton
  }],
})
export class IconButton {
  public icon = input.required<string>();
  protected readonly extended = true;
}
