import { Component } from '@angular/core';
import { MatListItem, MatListItemIcon, MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-library-page',
  imports: [MatListItem, RouterLink, MatListItemIcon, MatIcon, MatNavList],
  templateUrl: './library-page.html',
  styleUrl: './library-page.css',
  host: {
    class: 'page'
  }
})
export default class LibraryPage {}
