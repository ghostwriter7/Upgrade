import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { RandomSessionControl } from '@home/components/random-session-control/random-session-control';
import { SkillSessionSelector } from '@home/components/skill-session-selector/skill-session-selector';
import { TargetSummary } from '@home/components/target-summary/target-summary';
import { TemplateSelector } from '@home/components/template-selector/template-selector';
import { SessionCalendar } from '../session-calendar/session-calendar';

@Component({
  selector: 'app-home-page',
  imports: [
    MatButton,
    MatDivider,
    RouterLink,
    SessionCalendar,
    TemplateSelector,
    RandomSessionControl,
    SkillSessionSelector,
    TargetSummary,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
