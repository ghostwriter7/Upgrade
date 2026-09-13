import { AngleMeasurement, Landmark, Point } from '@domain/model/measurement.model';
import { BodyPart } from '@domain/enum/body-part.enum';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';
import { AngleMeasurementDto } from '@persistence/schema/angle-measurement.schema';

describe('AngleMeasurementMapper', () => {
  it('should map an entity to a dto', () => {
    const entity = AngleMeasurement.new('mediaId', 'exerciseLogId', 50, [
      new Landmark(new Point(0, 0), BodyPart.LeftAnkle),
      new Landmark(new Point(0, 0), BodyPart.PelvisCenter),
      new Landmark(new Point(0, 0), BodyPart.RightAnkle),
    ]);

    const dto = AngleMeasurementMapper.INSTANCE.toDto(entity);

    expect(dto).toEqual({
      id: entity.id,
      mediaId: entity.mediaId,
      exerciseLogId: entity.exerciseLogId,
      angle: 50,
      landmarks: [
        { point: { x: 0, y: 0 }, bodyPart: BodyPart.LeftAnkle },
        { point: { x: 0, y: 0 }, bodyPart: BodyPart.PelvisCenter },
        { point: { x: 0, y: 0 }, bodyPart: BodyPart.RightAnkle },
      ],
    });
  });

  it('should map a dto to an entity', () => {
    const dto: AngleMeasurementDto = {
      id: 'id',
      mediaId: 'mediaId',
      exerciseLogId: 'exerciseLogId',
      angle: 50,
      landmarks: [
        { point: { x: 0, y: 0 }, bodyPart: BodyPart.LeftAnkle },
        { point: { x: 0, y: 0 }, bodyPart: BodyPart.PelvisCenter },
        { point: { x: 0, y: 0 }, bodyPart: BodyPart.RightAnkle },
      ],
    };

    const entity = AngleMeasurementMapper.INSTANCE.toDomain(dto);

    expect(entity).toBeInstanceOf(AngleMeasurement);
    expect(entity).toEqual({
      id: dto.id,
      mediaId: dto.mediaId,
      exerciseLogId: dto.exerciseLogId,
      angle: dto.angle,
      landmarks: dto.landmarks.map(
        (landmark) =>
          new Landmark(new Point(landmark.point.x, landmark.point.y), landmark.bodyPart),
      ),
    });
  });
});
