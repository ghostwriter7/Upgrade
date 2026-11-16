import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { MatRipple } from '@angular/material/core';
import { MatFabButton } from '@angular/material/button';

@Component({
  selector: 'app-tab-bar',
  imports: [MatIcon, RouterLink, RouterLinkActive, MatRipple, MatFabButton],
  templateUrl: './tab-bar.html',
  styleUrl: './tab-bar.css',
})
export class TabBar {
  protected readonly options: Partial<IsActiveMatchOptions> = { paths: 'subset' };
  protected readonly items = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/library', icon: 'fitness_center', label: 'Library' },
    { path: '/session/new', icon: 'add', label: 'Start', isHighlight: true },
    { path: '/habits', icon: 'insights', label: 'Habits' },
    { path: '/more', icon: 'settings', label: 'More' },
  ];
}
