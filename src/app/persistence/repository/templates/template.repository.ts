import { Service } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import { Template } from '@domain/model/template/template.model';
import { StoreName } from '@persistence/repository/store-name.enum';
import { TemplateDto, TemplateSchema } from '@persistence/schema/template.schema';

@Service()
export class TemplateRepository extends GenericRepository<TemplateDto> {
  constructor() {
    super();
  }

  public async getAllTemplates(): Promise<Template[]> {
    const templates = await super.findAll(StoreName.TEMPLATES);
    return templates.map((template) => TemplateSchema.parse(template));
  }

  public save(template: Template): Promise<IDBValidKey> {
    return super.put(StoreName.TEMPLATES, TemplateSchema.parse(template));
  }
}
