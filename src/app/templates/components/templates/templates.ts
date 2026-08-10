import { Component, inject } from '@angular/core';
import { TemplatesList } from '../templates-list/templates-list';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-templates',
  imports: [TemplatesList, MatButton],
  templateUrl: './templates.html',
  styleUrl: './templates.css',
  host: {
    class: 'page',
  },
})
export default class Templates {
  private readonly router = inject(Router);

  protected goToNewTemplateView(): void {
    this.router.navigateByUrl('templates/edit');
  }
}
