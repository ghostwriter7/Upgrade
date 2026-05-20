import { Mapper } from './mapper.interface';
import { VideoMedia } from '../../domain/model/exercise-media.model';
import { VideoMediaDto } from '../schema/media.schema';
import { DateHelper } from '../../common/helper/date.helper';

export class VideoMediaMapper implements Mapper<VideoMedia, VideoMediaDto> {
  public static readonly INSTANCE = new VideoMediaMapper();

  public toDomain(dto: VideoMediaDto): VideoMedia {
    return new VideoMedia(
      dto.uuid,
      dto.sessionId,
      dto.exerciseId,
      dto.blob,
      DateHelper.from(dto.createdAt),
      dto.duration,
    );
  }

  toDto(entity: VideoMedia): VideoMediaDto {
    return {
      uuid: entity.uuid,
      sessionId: entity.sessionId,
      exerciseId: entity.exerciseId,
      createdAt: entity.createdAt.toString({ smallestUnit: 'second' }),
      duration: entity.duration,
      type: entity.type,
      mimeType: entity.mimeType,
      blob: entity.blob,
    };
  }
}
