import { Component, inject } from '@angular/core';
import { DontsStore } from '@donts/store/donts.store';

@Component({
  selector: 'app-donts-stats',
  templateUrl: './donts-stats.html',
  styleUrl: './donts-stats.css',
})
export class DontsStats {
  private readonly dontsStore = inject(DontsStore);


  protected readonly weekSlipCount = this.dontsStore.weekSlipCount;
}
