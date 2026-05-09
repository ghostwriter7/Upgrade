import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';

@Component({
  selector: 'app-home-page',
  imports: [MatButton, MatDivider],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
