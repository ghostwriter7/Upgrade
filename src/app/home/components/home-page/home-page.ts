import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { SessionCalendar } from '../session-calendar/session-calendar';
import { SkillCoverage } from '@home/components/skill-coverage/skill-coverage';

@Component({
  selector: 'app-home-page',
  imports: [MatButton, MatDivider, RouterLink, SessionCalendar, SkillCoverage],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
