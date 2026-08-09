import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TemplateStore } from '../../store/template.store';
import {
  MatExpansionModule,
} from '@angular/material/expansion';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Template } from '@domain/model/template/template.model';

@Component({
  selector: 'app-templates-list',
  imports: [
    MatExpansionModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
  ],
  templateUrl: './templates-list.html',
  styleUrl: './templates-list.css',
})
export class TemplatesList {
  private readonly store = inject(TemplateStore);
  protected readonly templates = this.store.templates;

  protected toggleFavourite(template: Template): void {
    this.store.toggleFavourite(template);
  }
}
