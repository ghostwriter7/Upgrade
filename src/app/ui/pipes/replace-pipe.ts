import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
})
export class ReplacePipe implements PipeTransform {
  public transform(input: string, toBeReplaced: string, withValue: string): string {
    return input.replaceAll(toBeReplaced, withValue);
  }
}
