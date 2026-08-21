import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { SessionCalendar } from '../session-calendar/session-calendar';
import { SkillCoverage } from '@home/components/skill-coverage/skill-coverage';
import { TemplateSelector } from '@home/components/template-selector/template-selector';
import { RandomSessionControl } from '@home/components/random-session-control/random-session-control';
import { SkillSessionSelector } from '@home/components/skill-session-selector/skill-session-selector';

@Component({
  selector: 'app-home-page',
  imports: [
    MatButton,
    MatDivider,
    RouterLink,
    SessionCalendar,
    SkillCoverage,
    TemplateSelector,
    RandomSessionControl,
    SkillSessionSelector,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
