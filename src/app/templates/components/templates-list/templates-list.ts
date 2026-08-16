import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TemplateStore } from '../../store/template.store';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { Template } from '@domain/model/template/template.model';
import { ExerciseNamePipe } from '@ui/pipes/exercise-name-pipe';
import { MatList, MatListItem } from '@angular/material/list';
import { MatMiniFabButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { ConfirmDeleteAlert } from '@session/components/confirm-delete-alert/confirm-delete-alert.component';
import { DialogService } from '@common/service/dialog/dialog.service';
import { RateOfPerceivedEffortIconPipe } from '@templates/pipes/rate-of-perceived-effort-icon.pipe';

@Component({
  selector: 'app-templates-list',
  encapsulation: ViewEncapsulation.None,
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
    RateOfPerceivedEffortIconPipe,
  ],
  templateUrl: './templates-list.html',
  styleUrl: './templates-list.css',
  providers: [DialogService],
})
export class TemplatesList {
  private readonly store = inject(TemplateStore);
  protected readonly templates = this.store.templates;
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  protected toggleFavourite(template: Template): void {
    this.store.toggleFavourite(template);
  }

  protected onEdit(template: Template): void {
    this.store.setEdited(template);
    this.router.navigate(['templates', 'edit']);
  }

  protected onDelete(template: Template): void {
    this.dialogService.open(ConfirmDeleteAlert, () => this.store.delete(template));
  }
}
