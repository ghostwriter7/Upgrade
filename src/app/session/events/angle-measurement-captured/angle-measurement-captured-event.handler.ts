import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import {
  AngleMeasurementCapturedEvent
} from '@session/events/angle-measurement-captured/angle-measurement-captured.event';
import { Constructor } from '@common/types/constructor.type';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';

@Injectable()
export class AngleMeasurementCapturedEventHandler implements EventHandler<AngleMeasurementCapturedEvent> {
  private readonly angleMeasurementRepository = inject(AngleMeasurementRepository);

 public appliesTo(): Constructor<AngleMeasurementCapturedEvent> {
    return AngleMeasurementCapturedEvent;
  }

  public handle(event: AngleMeasurementCapturedEvent): void {
   this.angleMeasurementRepository.saveMeasurement(event.angleMeasurement);
  }

}
