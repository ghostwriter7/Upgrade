import { Component, inject } from '@angular/core';
import { DontsHeader } from '../donts-header/donts-header';
import { DontsStats } from '../donts-stats/donts-stats';
import { DontsEntry } from '../donts-entry/donts-entry';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DontsForm } from '../donts-form/donts-form';
import { DontsStore } from '../../store/donts.store';

@Component({
  selector: 'app-donts-page',
  imports: [DontsHeader, DontsStats, DontsEntry, MatButton, FormsModule, DontsForm],
  templateUrl: './donts-page.html',
  styleUrl: './donts-page.css',
  host: {
    class: 'page',
  },
})
export default class DontsPage {
  private readonly dontsStore = inject(DontsStore);
  protected readonly donts = this.dontsStore.donts;

  protected onCreateNew(title: string): void {
    this.dontsStore.create({ title });
  }
}
