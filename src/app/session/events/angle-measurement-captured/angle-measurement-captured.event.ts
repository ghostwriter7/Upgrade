import { DomainEvent } from '@common/routers/event/domain-event';
import { AngleMeasurement } from '@domain/model/measurement.model';

export class AngleMeasurementCapturedEvent extends DomainEvent {
  constructor(public readonly angleMeasurement: AngleMeasurement) {
    super();
  }
}
