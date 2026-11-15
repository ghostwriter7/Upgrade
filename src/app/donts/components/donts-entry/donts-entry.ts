import { Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Dont } from '../../model/dont.interface';
import { DontsStore } from '@donts/store/donts.store';

@Component({
  selector: 'app-donts-entry',
  imports: [MatButton],
  templateUrl: './donts-entry.html',
  styleUrl: './donts-entry.css',
})
export class DontsEntry {
  public dont = input.required<Dont>();

  private readonly dontsStore = inject(DontsStore);

  protected logSlip(): void {
    this.dontsStore.logSlip(this.dont().id);
  }
}
