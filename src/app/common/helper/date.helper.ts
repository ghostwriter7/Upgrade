import type { Temporal as TemporalType } from '@js-temporal/polyfill';

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
}
