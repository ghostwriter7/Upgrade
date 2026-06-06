import { Mapper } from './mapper.interface';
import { ExerciseMedia, Size } from '@domain/model/exercise-media.model';
import {
  ExerciseMediaBaseDto,
  ExerciseMediaDto,
  JsonSerializedMediaDto,
} from '../schema/media.schema';
import { DateHelper } from '@common/helper/date.helper';
import { BlobHelper } from '@common/helper/blob/blob.helper';

export class ExerciseMediaMapper implements Mapper<ExerciseMedia, ExerciseMediaDto> {
  public static readonly INSTANCE = new ExerciseMediaMapper();

  public readonly fromJson = (dto: JsonSerializedMediaDto): ExerciseMedia => {
    return new ExerciseMedia(
      dto.id,
      dto.exerciseId,
      dto.exerciseLogId,
      BlobHelper.toBlob(dto.base64, dto.mimeType),
      new Size(dto.width, dto.height),
      dto.mimeType,
      DateHelper.from(dto.createdAt),
    );
  }

  public readonly toJson = async (entity: ExerciseMedia): Promise<JsonSerializedMediaDto> => {
    return {
      ...this.toBaseDto(entity),
      base64: await BlobHelper.toBase64(entity.blob),
    };
  }

  public readonly toDomain = (dto: ExerciseMediaDto): ExerciseMedia => {
    return new ExerciseMedia(
      dto.id,
      dto.exerciseId,
      dto.exerciseLogId,
      dto.blob,
      new Size(dto.width, dto.height),
      dto.mimeType,
      DateHelper.from(dto.createdAt),
    );
  }

  public readonly toDto = (entity: ExerciseMedia): ExerciseMediaDto => {
    return {
      ...this.toBaseDto(entity),
      blob: entity.blob,
    };
  }

  private readonly toBaseDto = (entity: ExerciseMedia): ExerciseMediaBaseDto => ({
    id: entity.id,
    exerciseLogId: entity.exerciseLogId,
    exerciseId: entity.exerciseId,
    createdAt: entity.createdAt.toString({ smallestUnit: 'second' }),
    mimeType: entity.mimeType,
    width: entity.size.width,
    height: entity.size.height,
  });
}
