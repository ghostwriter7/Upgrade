import type { Temporal as TemporalType } from '@js-temporal/polyfill';

export class DateHelper {
  public static readonly WARSAW_TIMEZONE = 'Europe/Warsaw';

  public static now(): TemporalType.Instant {
    return Temporal.Now.instant();
  }

  public static from(date: string): TemporalType.Instant {
    return Temporal.Instant.from(date);
  }

  public static toLocal(input: TemporalType.Instant | TemporalType.PlainDate): TemporalType.ZonedDateTime {
    if (input instanceof Temporal.PlainDate) {
      return input.toZonedDateTime(DateHelper.WARSAW_TIMEZONE);
    }

    return input.toZonedDateTimeISO(DateHelper.WARSAW_TIMEZONE);
  }
}
