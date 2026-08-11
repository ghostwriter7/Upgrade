import { Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatMiniFabButton } from '@angular/material/button';
import { Template } from '@domain/model/template/template.model';
import { Router } from '@angular/router';
import { TemplateFacade } from '@templates/template.facade';
import { CommandBus } from '@common/routers/command/command-bus';
import { CreateFromTemplateCommand } from '@session/commands/create-from-template/create-from-template.command';

@Component({
  selector: 'app-template-selector',
  imports: [MatIcon, MatMenu, MatMiniFabButton, MatMenuTrigger, MatMenuItem],
  templateUrl: './template-selector.html',
  styleUrl: './template-selector.css',
})
export class TemplateSelector {
  private readonly router = inject(Router);
  private readonly templateFacade = inject(TemplateFacade);
  private readonly commandBus = inject(CommandBus);

  protected readonly isDisabled = computed(() => !this.templates().length);
  protected readonly templates = this.templateFacade.$templates;

  protected selectTemplate(template: Template): void {
    this.commandBus.dispatch(new CreateFromTemplateCommand(template));
    this.router.navigate(['session', 'edit']);
  }
}
