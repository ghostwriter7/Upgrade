import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TemplateStore } from '../../store/template.store';
import {
  MatExpansionModule,
} from '@angular/material/expansion';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Template } from '@domain/model/template/template.model';
import { ExerciseNamePipe } from '@ui/pipes/exercise-name-pipe';
import { MatList, MatListItem } from '@angular/material/list';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'app-templates-list',
  imports: [
    MatExpansionModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    ExerciseNamePipe,
    MatList,
    MatListItem,
    MatCardActions,
    MatMiniFabButton,
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
