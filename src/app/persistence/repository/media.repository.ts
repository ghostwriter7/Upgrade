import { Injectable } from '@angular/core';
import { GenericRepository } from './generic.repository';
import { VideoMediaDto } from '../schema/media.schema';
import { VideoMedia } from '../../domain/model/exercise-media.model';
import { StoreName } from './store-name.enum';
import { VideoMediaMapper } from '../mapper/video-media.mapper';

@Injectable({ providedIn: 'root' })
export class MediaRepository extends GenericRepository<VideoMediaDto> {
  constructor() {
    super();
  }

  public async findMedia(id: string): Promise<VideoMedia | null> {
    const result = await super.findById(StoreName.MEDIA, id);
    return result ? VideoMediaMapper.INSTANCE.toDomain(result) : null;
  }

  public save(media: VideoMedia): Promise<void> {
    return this.put(StoreName.MEDIA, VideoMediaMapper.INSTANCE.toDto(media));
  }

  public deleteMedia(mediaId: string): Promise<boolean> {
    return super.delete(StoreName.MEDIA, mediaId);
  }
}
