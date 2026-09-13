import { Mapper } from './mapper.interface';
import { ExerciseMedia, Size } from '@domain/model/exercise-media.model';
import { ExerciseMediaDto } from '../schema/media.schema';

export class ExerciseMediaMapper implements Mapper<ExerciseMedia, ExerciseMediaDto> {
  public static readonly INSTANCE = new ExerciseMediaMapper();

  public readonly fromDto = (dto: ExerciseMediaDto): ExerciseMedia => {
    return new ExerciseMedia(
      dto.id,
      dto.exerciseId,
      dto.exerciseLogId,
      new Size(dto.width, dto.height),
      dto.mimeType,
    );
  };

  public readonly toDomain = (dto: ExerciseMediaDto): ExerciseMedia => {
    return new ExerciseMedia(
      dto.id,
      dto.exerciseId,
      dto.exerciseLogId,
      new Size(dto.width, dto.height),
      dto.mimeType,
    );
  };

  public readonly toDto = (entity: ExerciseMedia): ExerciseMediaDto => ({
    id: entity.id,
    exerciseLogId: entity.exerciseLogId,
    exerciseId: entity.exerciseId,
    mimeType: entity.mimeType,
    width: entity.size.width,
    height: entity.size.height,
  });
}
