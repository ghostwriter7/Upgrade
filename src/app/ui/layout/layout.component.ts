import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Content } from '../content/content';
import { RouterLink } from '@angular/router';
import { InstallUpdate } from '@ui/install-update/install-update';
import { TabBar } from '@ui/tab-bar/tab-bar';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    Content,
    RouterLink,
    InstallUpdate,
    TabBar,
  ],
})
export class LayoutComponent {}
