import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { pad } from '../function/pad-time.function';

export class DateHelper {
  public static readonly WARSAW_TIMEZONE = 'Europe/Warsaw';

  public static now(): TemporalType.Instant {
    return Temporal.Now.instant();
  }

  public static from(date: string): TemporalType.Instant {
    return Temporal.Instant.from(date);
  }

  public static toLocal(
    input: TemporalType.Instant | TemporalType.PlainDate | string,
  ): TemporalType.ZonedDateTime {
    if (typeof input === 'string') {
      if (input.length === 10)
        return Temporal.PlainDate.from(input).toZonedDateTime({
          plainTime: '00:00',
          timeZone: DateHelper.WARSAW_TIMEZONE,
        });

      throw new Error('No other string input but matching pattern of YYYY-MM-DD is supported for now');
    }

    if (input instanceof Temporal.PlainDate) {
      return input.toZonedDateTime(DateHelper.WARSAW_TIMEZONE);
    }

    return input.toZonedDateTimeISO(DateHelper.WARSAW_TIMEZONE);
  }

  public static stringifyDuration(durationInSeconds: number): string {
    const { minutes, seconds, milliseconds } = Temporal.Duration.from({
      milliseconds: Math.floor(durationInSeconds * 1000),
    }).round({ largestUnit: 'minute' });
    const twoDigitMilliseconds = milliseconds.toString().padStart(3, '0').slice(0, 2);
    return `${pad(minutes)}:${pad(seconds)}:${twoDigitMilliseconds}`;
  }
}
