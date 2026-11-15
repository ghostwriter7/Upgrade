import { Component } from '@angular/core';
import { DontsHeader } from '../donts-header/donts-header';
import { DontsStats } from '../donts-stats/donts-stats';
import { DontsEntry } from '../donts-entry/donts-entry';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DontsForm } from '../donts-form/donts-form';

@Component({
  selector: 'app-donts-page',
  imports: [
    DontsHeader,
    DontsStats,
    DontsEntry,
    MatButton,
    FormsModule,
    DontsForm,
  ],
  templateUrl: './donts-page.html',
  styleUrl: './donts-page.css',
  host: {
    class: 'page',
  },
})
export default class DontsPage {

  protected onCreateNew(title: string): void {
    console.log(title);
  }
}
