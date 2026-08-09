import { Component, computed, inject } from '@angular/core';
import {
  MatDivider,
  MatList,
  MatListItem,
  MatListSubheaderCssMatStyler,
} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { TemplateStore } from '../../store/template.store';

@Component({
  selector: 'app-templates-list',
  imports: [MatList, MatListSubheaderCssMatStyler, MatDivider, MatListItem],
  templateUrl: './templates-list.html',
  styleUrl: './templates-list.css',
})
export class TemplatesList {
  private readonly store = inject(TemplateStore);
  private readonly allTemplates = this.store.templates;
  private readonly favouriteTemplateKey = 'FAVOURITE';
  private readonly normalTemplateKey = 'BASIC';

  private readonly groupedTemplates = computed(() => {
    const templates = this.allTemplates();
    return Object.groupBy(templates, (template) =>
      template.isFavourite ? this.favouriteTemplateKey : this.normalTemplateKey,
    );
  });

  protected readonly favourites = computed(
    () => this.groupedTemplates()[this.favouriteTemplateKey] || [],
  );
  protected readonly templates = computed(() => this.groupedTemplates()[this.normalTemplateKey] || []);
  protected readonly showFavouriteSection = computed(() => !!this.favourites()?.length);
  protected readonly showNormalSection = computed(() => !!this.templates()?.length);
  protected readonly templatesExist = computed(() => !!this.allTemplates().length);
}
