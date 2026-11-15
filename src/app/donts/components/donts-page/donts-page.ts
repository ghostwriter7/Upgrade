import { Component } from '@angular/core';
import { DontsHeader } from '../donts-header/donts-header';
import { DontsStats } from '../donts-stats/donts-stats';
import { DontsEntry } from '../donts-entry/donts-entry';

@Component({
  selector: 'app-donts-page',
  imports: [DontsHeader, DontsStats, DontsEntry],
  templateUrl: './donts-page.html',
  styleUrl: './donts-page.css',
  host: {
    class: 'page'
  }
})
export default class DontsPage {}
