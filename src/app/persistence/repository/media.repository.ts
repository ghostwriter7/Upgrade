import { Injectable } from '@angular/core';
import { GenericRepository } from './generic.repository';
import { ExerciseMediaDto } from '../schema/media.schema';
import { ExerciseMedia } from '@domain/model/exercise-media.model';
import { StoreName } from './store-name.enum';
import { ExerciseMediaMapper } from '../mapper/exercise-media.mapper';
import { IndexName } from './index-name.enum';

@Injectable({ providedIn: 'root' })
export class MediaRepository extends GenericRepository<ExerciseMediaDto> {
  constructor() {
    super();
  }

  public async findMedia(id: string): Promise<ExerciseMedia | null> {
    const result = await super.findById(StoreName.MEDIA, id);
    return result ? ExerciseMediaMapper.INSTANCE.toDomain(result) : null;
  }

  public save(media: ExerciseMedia): Promise<IDBValidKey> {
    return this.put(StoreName.MEDIA, ExerciseMediaMapper.INSTANCE.toDto(media));
  }

  public deleteMedia(mediaId: string): Promise<void> {
    return super.delete(StoreName.MEDIA, mediaId);
  }

  public async deleteAllBySessionId(sessionId: string): Promise<void> {
    return super.deleteAllByIndex(StoreName.MEDIA, IndexName.MediaBySessionId, sessionId);
  }
}
