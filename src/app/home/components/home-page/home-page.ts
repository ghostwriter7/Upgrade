import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { SkillSessionSelector } from '@home/components/skill-session-selector/skill-session-selector';
import { TargetSummary } from '@home/components/target-summary/target-summary';
import { SessionCalendar } from '../session-calendar/session-calendar';

@Component({
  selector: 'app-home-page',
  imports: [
    MatButton,
    MatDivider,
    RouterLink,
    SessionCalendar,
    SkillSessionSelector,
    TargetSummary,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
