import { Mapper } from './mapper.interface';
import { ExerciseMedia } from '../../domain/model/exercise-media.model';
import { ExerciseMediaDto } from '../schema/media.schema';
import { DateHelper } from '../../common/helper/date.helper';

export class ExerciseMediaMapper implements Mapper<ExerciseMedia, ExerciseMediaDto> {
  public static readonly INSTANCE = new ExerciseMediaMapper();

  public toDomain(dto: ExerciseMediaDto): ExerciseMedia {
    return new ExerciseMedia(
      dto.uuid,
      dto.exerciseId,
      dto.sessionId,
      'image/jpeg',
      dto.blob,
      DateHelper.from(dto.createdAt),
      dto.width,
      dto.height
    );
  }

  toDto(entity: ExerciseMedia): ExerciseMediaDto {
    return {
      uuid: entity.uuid,
      sessionId: entity.sessionId,
      exerciseId: entity.exerciseId,
      createdAt: entity.createdAt.toString({ smallestUnit: 'second' }),
      mimeType: entity.mimeType,
      blob: entity.blob,
      width: entity.width,
      height: entity.height
    };
  }
}
