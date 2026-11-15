import { Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { UiDont } from '../../model/dont.interface';
import { DontsStore } from '@donts/store/donts.store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-donts-entry',
  imports: [MatButton, NgClass],
  templateUrl: './donts-entry.html',
  styleUrl: './donts-entry.css',
})
export class DontsEntry {
  public dont = input.required<UiDont>();

  private readonly dontsStore = inject(DontsStore);

  protected logSlip(): void {
    this.dontsStore.logSlip(this.dont().id);
  }
}
