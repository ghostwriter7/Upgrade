import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'printHours',
})
export class PrintHoursPipe implements PipeTransform {
  public transform(value?: number): string {
    if (!value) return 'Never';

    if (value < 24) return `${value}h ago`;

    const days = (value / 24).toFixed(0);
    const hours = value % 24;

    if (hours) return `${days}d ${hours}h ago`;

    return `${days}d ago`;
  }
}
