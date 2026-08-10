import { Component, computed, inject, resource } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatMiniFabButton } from '@angular/material/button';
import { TemplateRepository } from '@persistence/repository/templates/template.repository';
import { Template } from '@domain/model/template/template.model';
import { Session } from '@domain/model/session/session.model';
import { SessionStateHolder } from '@session/store/session-state-holder.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-selector',
  imports: [MatIcon, MatMenu, MatMiniFabButton, MatMenuTrigger, MatMenuItem],
  templateUrl: './template-selector.html',
  styleUrl: './template-selector.css',
})
export class TemplateSelector {
  private readonly templateRepository = inject(TemplateRepository);
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly router = inject(Router);

  private readonly templateResource = resource({
    loader: () => this.templateRepository.getAllTemplates(),
  });

  protected readonly isDisabled = computed(() => !this.templates().length);
  protected readonly templates = computed(() => {
    if (this.templateResource.hasValue()) {
      return this.templateResource.value();
    }
    return [];
  });

  protected selectTemplate(template: Template): void {
    const { session } = Session.createEmpty().addExerciseLogs(template.exerciseIds);
    this.sessionStateHolder.set(session);
    this.router.navigate(['session', 'edit']);
  }
}
