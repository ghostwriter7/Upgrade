import { TestBed } from '@angular/core/testing';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';
import { Mock } from 'vitest';
import { AngleMeasurementCapturedEventHandler } from '@session/events/angle-measurement-captured/angle-measurement-captured-event.handler';
import { AngleMeasurementCapturedEvent } from '@session/events/angle-measurement-captured/angle-measurement-captured.event';
import { AngleMeasurement, Landmark, Point } from '@domain/model/measurement.model';
import { BodyPart } from '@domain/enum/body-part.enum';

describe('AngleMeasurementCapturedEventHandler', () => {
  let angleMeasurementRepositoryMock: { saveMeasurement: Mock };
  let handler: AngleMeasurementCapturedEventHandler;

  beforeEach(() => {
    angleMeasurementRepositoryMock = {
      saveMeasurement: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AngleMeasurementRepository, useValue: angleMeasurementRepositoryMock },
        AngleMeasurementCapturedEventHandler,
      ],
    });

    handler = TestBed.inject(AngleMeasurementCapturedEventHandler);
  });

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(AngleMeasurementCapturedEvent));

  it('should save an angle measurement in the database', () => {
    const event = new AngleMeasurementCapturedEvent(
      AngleMeasurement.new('mediaId', 'exerciseId', 'exerciseLogId', 120, [
        new Landmark(new Point(0, 0), BodyPart.LeftAnkle),
      ]),
    );

    handler.handle(event);

    expect(angleMeasurementRepositoryMock.saveMeasurement).toHaveBeenCalledWith(event.angleMeasurement);
  });
});
