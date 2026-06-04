import { Mapper } from '@persistence/mapper/mapper.interface';
import { AngleMeasurement, Landmark, Point } from '@domain/model/measurement.model';
import { AngleMeasurementDto } from '@persistence/schema/angle-measurement.schema';
import { DateHelper } from '@common/helper/date.helper';

export class AngleMeasurementMapper implements Mapper<AngleMeasurement, AngleMeasurementDto> {
  public static readonly INSTANCE = new AngleMeasurementMapper();

  public toDomain(dto: AngleMeasurementDto): AngleMeasurement {
    return new AngleMeasurement(
      dto.id,
      dto.mediaId,
      dto.exerciseId,
      dto.exerciseLogId,
      dto.angle,
      dto.landmarks.map(
        ({ point, bodyPart }) => new Landmark(new Point(point.x, point.y), bodyPart),
      ),
      DateHelper.from(dto.createdAt),
    );
  }

  public toDto(entity: AngleMeasurement): AngleMeasurementDto {
    return {
      id: entity.id,
      mediaId: entity.mediaId,
      exerciseId: entity.exerciseId,
      exerciseLogId: entity.exerciseLogId,
      angle: entity.angle,
      landmarks: entity.landmarks.map(({ point, bodyPart }) => ({
        point: { x: point.x, y: point.y },
        bodyPart,
      })),
      createdAt: entity.createdAt.toString({ smallestUnit: 'seconds' }),
    };
  }
}
