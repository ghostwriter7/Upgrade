import { Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatMiniFabButton } from '@angular/material/button';
import { Template } from '@domain/model/template/template.model';
import { Session } from '@domain/model/session/session.model';
import { SessionStateHolder } from '@session/store/session-state-holder.store';
import { Router } from '@angular/router';
import { TemplateFacade } from '@templates/template.facade';

@Component({
  selector: 'app-template-selector',
  imports: [MatIcon, MatMenu, MatMiniFabButton, MatMenuTrigger, MatMenuItem],
  templateUrl: './template-selector.html',
  styleUrl: './template-selector.css',
})
export class TemplateSelector {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly router = inject(Router);
  private readonly templateFacade = inject(TemplateFacade);

  protected readonly isDisabled = computed(() => !this.templates().length);
  protected readonly templates = this.templateFacade.$templates;

  protected selectTemplate(template: Template): void {
    const { session } = Session.createEmpty().addExerciseLogs(template.exerciseIds);
    this.sessionStateHolder.set(session);
    this.router.navigate(['session', 'edit']);
  }
}
