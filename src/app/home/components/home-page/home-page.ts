import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { SessionCalendar } from '../session-calendar/session-calendar';
import { SkillCoverage } from '@home/components/skill-coverage/skill-coverage';
import { TemplateSelector } from '@home/components/template-selector/template-selector';

@Component({
  selector: 'app-home-page',
  imports: [MatButton, MatDivider, RouterLink, SessionCalendar, SkillCoverage, TemplateSelector],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
