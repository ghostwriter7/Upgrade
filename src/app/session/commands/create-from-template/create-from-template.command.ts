import { Command } from '@common/routers/command/command';
import { Template } from '@domain/model/template/template.model';

export class CreateFromTemplateCommand extends Command {
  constructor(public readonly template: Template) {
    super();
  }
}
