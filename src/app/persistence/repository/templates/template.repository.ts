import { Service } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import { Template } from '@domain/model/template/template.model';
import { StoreName } from '@persistence/repository/store-name.enum';

@Service()
export class TemplateRepository extends GenericRepository<Template> {
  constructor() {
    super();
  }

  public getAllTemplates(): Promise<Template[]> {
    return super.findAll(StoreName.TEMPLATES);
  }
}
