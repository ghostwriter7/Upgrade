import { Mapper } from './mapper.interface';
import { ExerciseMedia, Size } from '@domain/model/exercise-media.model';
import { ExerciseMediaDto } from '../schema/media.schema';
import { DateHelper } from '@common/helper/date.helper';

export class ExerciseMediaMapper implements Mapper<ExerciseMedia, ExerciseMediaDto> {
  public static readonly INSTANCE = new ExerciseMediaMapper();

  public toDomain(dto: ExerciseMediaDto): ExerciseMedia {
    return new ExerciseMedia(
      dto.id,
      dto.exerciseId,
      dto.exerciseLogId,
      dto.blob,
      new Size(dto.width, dto.height),
      'image/jpeg',
      DateHelper.from(dto.createdAt),
    );
  }

  toDto(entity: ExerciseMedia): ExerciseMediaDto {
    return {
      id: entity.id,
      exerciseLogId: entity.exerciseLogId,
      exerciseId: entity.exerciseId,
      createdAt: entity.createdAt.toString({ smallestUnit: 'second' }),
      mimeType: entity.mimeType,
      blob: entity.blob,
      width: entity.size.width,
      height: entity.size.height
    };
  }
}
