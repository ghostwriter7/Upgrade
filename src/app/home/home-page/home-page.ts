import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { SessionCalendar } from '../session-calendar/session-calendar';
import { Timer } from '../../session/timer/timer';

@Component({
  selector: 'app-home-page',
  imports: [MatButton, MatDivider, RouterLink, SessionCalendar, Timer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
