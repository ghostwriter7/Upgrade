import { Pipe, PipeTransform } from '@angular/core';
import { RateOfPerceivedEffort } from '@domain/enum/rate-of-perceived-effort-value';

@Pipe({ name: 'rateOfPerceivedEffortIcon' })
export class RateOfPerceivedEffortIconPipe implements PipeTransform {
  public transform(value: RateOfPerceivedEffort): string {
    switch (value) {
      case 'easy':
        return '🟢';
      case 'mid':
        return '🟡';
      case 'hard':
        return '🔴';
    }
  }
}
